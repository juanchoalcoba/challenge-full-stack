// shared/types.ts
export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  customer_name: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  created_at: string; // ISO date string
}

// Para paginación
export interface PaginatedOrders {
  data: Order[];
  page: number;
  page_size: number;
  total: number;
  
}
