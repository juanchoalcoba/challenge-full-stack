import request from "supertest";
import { app } from "../app"
import { OrderModel } from "../models/Order";


beforeAll(async () => {
  await OrderModel.deleteMany({});
});

afterAll(async () => {
  await OrderModel.deleteMany({});
});

describe("Orders API", () => {
  let orderId: string;

  it("should create a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ customer_name: "Juan", item: "Laptop", quantity: 2, status: "pending" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    orderId = res.body.id
  });

  it("should fetch the order by id", async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.customer_name).toBe("Juan");
  });

  it("should update the order", async () => {
    const res = await request(app).put(`/api/orders/${orderId}`).send({ status: "completed" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  it("should fetch orders filtered by status", async () => {
    await OrderModel.create({ customer_name: "Ana", item: "Mouse", quantity: 1, status: "pending" });
    const res = await request(app).get("/api/orders?page=1&page_size=5&status=pending");
    expect(res.status).toBe(200);
    expect(res.body.data.every((o: any) => o.status === "pending")).toBe(true);
  });

  it("should delete the order", async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.status).toBe(204);
  });
});
