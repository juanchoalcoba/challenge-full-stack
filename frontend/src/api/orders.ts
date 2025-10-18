import axios from "axios";
import { Order, PaginatedOrders } from "@shared/types";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getOrders = async (
  page: number,
  page_size: number,
  status?: string
): Promise<PaginatedOrders> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("page_size", page_size.toString());
  if (status) params.append("status", status);

  const res = await api.get<PaginatedOrders>(`/orders?${params.toString()}`);
  return res.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const res = await api.get<Order>(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (order: Omit<Order, "id" | "created_at">): Promise<Order> => {
  const res = await api.post<Order>("/orders", order);
  return res.data;
};

export const updateOrder = async (id: string, order: Partial<Order>): Promise<Order> => {
  const res = await api.put<Order>(`/orders/${id}`, order);
  return res.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`/orders/${id}`);
};
