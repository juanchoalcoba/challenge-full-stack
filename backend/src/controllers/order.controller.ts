import { Request, Response } from "express";
import { OrderModel } from "../models/Order";
import { Order, PaginatedOrders } from "@shared/types";
import { Types } from "mongoose";

const formatOrder = (o: any): Order => ({
  id: (o._id as Types.ObjectId).toHexString(),
  customer_name: o.customer_name,
  item: o.item,
  quantity: o.quantity,
  status: o.status as Order["status"],
  created_at: o.created_at.toISOString(),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, item, quantity, status } = req.body;
    const order = new OrderModel({ customer_name, item, quantity, status });
    const saved = await order.save();
    res.status(201).json(formatOrder(saved));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando la orden" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(formatOrder(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo la orden" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updated = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(formatOrder(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando la orden" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando la orden" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const page_size = parseInt(req.query.page_size as string) || 5;
    const status = req.query.status as string | undefined;

    const filter: Partial<{ status: Order["status"] }> = {};
    if (status && ["pending", "completed", "cancelled"].includes(status)) {
      filter.status = status as Order["status"];
    }

    const total = await OrderModel.countDocuments(filter);
    const orders = await OrderModel.find(filter)
      .skip((page - 1) * page_size)
      .limit(page_size)
      .sort({ created_at: -1 }); 

    const data: Order[] = orders.map(formatOrder);

    const result: PaginatedOrders = {
      data,
      page,
      page_size,
      total,
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cargando las órdenes" });
  }
};
