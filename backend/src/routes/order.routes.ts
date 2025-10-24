import { Router } from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrders,
} from "../controllers/order.controller";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
router.get("/orders", getOrders);

export default router;
