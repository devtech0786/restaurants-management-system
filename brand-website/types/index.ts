// ─── Tenant ────────────────────────────────────────────────────────────────
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  coverUrl?: string;
  primaryColor: string;
  description?: string;
  cuisineTypes: string[];
  branches: Branch[];
}

// ─── Branch ────────────────────────────────────────────────────────────────
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  openingHours: OpeningHours[];
  isOpen: boolean;
  deliveryRadius: number;
  estimatedDeliveryTime: number;
}

export interface OpeningHours {
  day: number; // 0=Sun … 6=Sat
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// ─── Menu ──────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  variants: Variant[];
  addons: Addon[];
  tags: string[];
  preparationTime: number;
}

export interface Variant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  label: string;
  priceModifier: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
  maxSelections: number;
  options: AddonOption[];
}

export interface AddonOption {
  id: string;
  label: string;
  price: number;
}

// ─── Cart ──────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariants: Record<string, VariantOption>;
  selectedAddons: AddonOption[];
  specialInstructions?: string;
  unitPrice: number;
}

export interface Cart {
  tenantId: string;
  branchId: string;
  items: CartItem[];
}

// ─── Order ─────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  tenantId: string;
  branchId: string;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  estimatedDeliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusEvent[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variants: string[];
  addons: string[];
}

export interface DeliveryAddress {
  street: string;
  city: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

// ─── User / Auth ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  tenantId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Admin Analytics ───────────────────────────────────────────────────────
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  ordersGrowth: number;
  revenueGrowth: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
  topItems: { name: string; count: number }[];
}

// ─── API Responses ─────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
