"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Order, OrderStatus } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";

export function useRealtimeOrder(orderId: string | null) {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const s = io(WS_URL, { transports: ["websocket"] });
    setSocket(s);

    s.emit("subscribe:order", orderId);

    s.on("order:updated", (order: Partial<Order>) => {
      if (order.status) setStatus(order.status);
    });

    return () => {
      s.emit("unsubscribe:order", orderId);
      s.disconnect();
    };
  }, [orderId]);

  return { status };
}
