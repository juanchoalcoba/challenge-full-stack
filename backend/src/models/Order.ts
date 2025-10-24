import { Schema, model, Document } from "mongoose";
import { OrderStatus } from "@shared/types";

export interface IOrder extends Document {
  customer_name: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  created_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  customer_name: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  created_at: { type: Date, default: () => new Date() },
});

export const OrderModel = model<IOrder>("Order", OrderSchema);
