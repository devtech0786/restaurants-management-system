export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled"
  | "refunded";

export type OrderType = "dine-in" | "takeaway" | "delivery";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partially_paid";

export type PaymentMethod = "cash" | "card" | "online" | "split";

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  variantName?: string;
  categoryName: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialNote?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  totalOrders?: number;
  lifetimeValue?: number;
}

export interface StatusEvent {
  status: OrderStatus;
  at: string;
  by?: string;
  note?: string;
}

export interface InternalNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  franchiseId: string;
  franchiseName: string;
  type: OrderType;
  tableNumber?: string;
  covers?: number;
  deliveryAddress?: string;
  estimatedDeliveryAt?: string;
  assignedDriver?: string;
  pickupTime?: string;
  customer: OrderCustomer;
  assignedStaff?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  isPriority: boolean;
  estimatedReadyAt?: string;
  cancellationReason?: string;
  internalNotes: InternalNote[];
  statusHistory: StatusEvent[];
  placedAt: string;
  updatedAt: string;
  completedAt?: string;
}
