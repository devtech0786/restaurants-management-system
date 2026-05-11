import { apiClient } from "@/lib/api/client";
import type { Order } from "@/types";
import {
  MOCK_TENANT,
  MOCK_BRANCHES,
  MOCK_CATEGORIES,
  MOCK_ORDERS,
  MOCK_STATS,
  MOCK_USER,
} from "./data";
import Cookies from "js-cookie";

let installed = false;

// In-memory store for orders created during this session
const sessionOrders: Map<string, Order> = new Map();

export function installMockInterceptor() {
  if (installed) return;
  installed = true;

  apiClient.interceptors.request.use((config) => {
    // Tag the request so response interceptor knows to mock it
    (config as any)._mock = true;
    return config;
  });

  apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = error.config as any;
      if (!config?._mock) return Promise.reject(error);

      const { url = "", method = "get", data: body } = config;
      const m = method.toLowerCase();

      // ── Auth ─────────────────────────────────────────────────────────────
      if (url.includes("/auth/login")) {
        const parsed = typeof body === "string" ? JSON.parse(body) : body;
        if (parsed.email === MOCK_USER.email && parsed.password === "password") {
          Cookies.set("accessToken", "mock-access-token");
          Cookies.set("refreshToken", "mock-refresh-token");
          return mockResponse({
            user: MOCK_USER,
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
          });
        }
        return mockError(401, "Invalid credentials");
      }

      if (url.includes("/auth/me")) {
        return mockResponse(MOCK_USER);
      }

      if (url.includes("/auth/logout")) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return mockResponse({ message: "Logged out" });
      }

      // ── Tenant ────────────────────────────────────────────────────────────
      if (url.match(/\/tenants\/[^/]+\/branches\/nearest/)) {
        return mockResponse(MOCK_BRANCHES[0]);
      }
      if (url.match(/\/tenants\/[^/]+\/branches/)) {
        return mockResponse(MOCK_BRANCHES);
      }
      if (url.match(/\/tenants\/[^/]+/)) {
        return mockResponse({ ...MOCK_TENANT, branches: MOCK_BRANCHES });
      }

      // ── Menu ──────────────────────────────────────────────────────────────
      if (url.includes("/menu/search")) {
        const q = new URL(url, "http://x").searchParams.get("q") ?? "";
        const results = MOCK_CATEGORIES.flatMap((c) => c.items).filter((i) =>
          i.name.toLowerCase().includes(q.toLowerCase())
        );
        return mockResponse(results);
      }
      if (url.match(/\/menu\/items\/([^/]+)/) && m === "get") {
        const id = url.split("/menu/items/")[1];
        const item = MOCK_CATEGORIES.flatMap((c) => c.items).find((i) => i.id === id);
        return item ? mockResponse(item) : mockError(404, "Item not found");
      }
      if (url.includes("/menu/items") && m === "patch") {
        return mockResponse({ success: true });
      }
      if (url.includes("/menu/items") && m === "delete") {
        return mockResponse({ success: true });
      }
      if (url.includes("/menu/items") && m === "post") {
        const parsed = typeof body === "string" ? JSON.parse(body) : body ?? {};
        return mockResponse({ id: `item_${Date.now()}`, ...parsed, variants: [], addons: [], tags: [] });
      }
      if (url.includes("/menu/categories") && m === "get") {
        return mockResponse(MOCK_CATEGORIES);
      }
      if (url.includes("/menu/categories")) {
        return mockResponse({ success: true });
      }
      if (url.includes("/menu")) {
        return mockResponse(MOCK_CATEGORIES);
      }

      // ── Orders ────────────────────────────────────────────────────────────
      if (url.includes("/orders/me")) {
        const allOrders = [...Array.from(sessionOrders.values()), ...MOCK_ORDERS];
        return mockResponse({
          data: allOrders,
          total: allOrders.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
      }
      if (url.match(/\/orders\/([^/]+)/) && m === "patch") {
        return mockResponse({ success: true });
      }
      if (url.match(/\/orders\/([^/]+)/) && m === "get") {
        const id = url.split("/orders/")[1];
        const order = sessionOrders.get(id) ?? MOCK_ORDERS.find((o) => o.id === id);
        return order ? mockResponse(order) : mockError(404, "Order not found");
      }
      if (url.includes("/orders") && m === "post") {
        const parsed = typeof body === "string" ? JSON.parse(body) : body ?? {};
        const newOrder: Order = {
          ...MOCK_ORDERS[0],
          id: `order_${Date.now()}`,
          orderNumber: `BK-${1043 + Math.floor(Math.random() * 100)}`,
          status: "PENDING",
          paymentMethod: parsed.paymentMethod ?? "CASH",
          deliveryAddress: parsed.deliveryAddress ?? MOCK_ORDERS[0].deliveryAddress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [{ status: "PENDING", timestamp: new Date().toISOString() }],
        };
        sessionOrders.set(newOrder.id, newOrder);
        return mockResponse(newOrder);
      }
      if (url.includes("/orders")) {
        return mockResponse({
          data: MOCK_ORDERS,
          total: MOCK_ORDERS.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
      }

      // ── Admin ─────────────────────────────────────────────────────────────
      if (url.includes("/admin/stats")) {
        return mockResponse(MOCK_STATS);
      }
      if (url.includes("/admin/branches") && m === "post") {
        return mockResponse({ id: `branch_${Date.now()}`, ...JSON.parse(body ?? "{}"), isOpen: true, openingHours: [] });
      }
      if (url.includes("/admin/branches") && (m === "patch" || m === "delete")) {
        return mockResponse({ success: true });
      }
      if (url.includes("/admin/branding")) {
        return mockResponse({ success: true });
      }
      if (url.includes("/admin/upload")) {
        return mockResponse({ url: "https://via.placeholder.com/400x300" });
      }

      // ── Coupons ───────────────────────────────────────────────────────────
      if (url.includes("/coupons/validate")) {
        return mockResponse({ valid: true, discount: 0 });
      }

      // Fallback — return empty success
      return mockResponse({});
    }
  );
}

function mockResponse(data: unknown, status = 200) {
  return Promise.resolve({ data, status, headers: {}, config: {}, statusText: "OK" });
}

function mockError(status: number, message: string) {
  return Promise.reject({
    response: { status, data: { message, statusCode: status } },
    isAxiosError: true,
  });
}
