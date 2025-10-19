import { OrderModel } from "../models/Order";

describe("OrderModel schema", () => {
  it("debería tener los campos requeridos definidos correctamente", () => {
    const schemaPaths = Object.keys(OrderModel.schema.paths);

    expect(schemaPaths).toContain("customer_name");
    expect(schemaPaths).toContain("item");
    expect(schemaPaths).toContain("quantity");
    expect(schemaPaths).toContain("status");
    expect(schemaPaths).toContain("created_at");
  });

  it("debería tener valores por defecto correctos", () => {
    const doc = new OrderModel({
      customer_name: "Juan",
      item: "Monitor",
      quantity: 1,
    });

    expect(doc.status).toBe("pending");
    expect(doc.created_at).toBeInstanceOf(Date);
  });

  it("debería lanzar error si falta un campo requerido", async () => {
    const invalidOrder = new OrderModel({}); 

    try {
      await invalidOrder.validate();
      throw new Error("El test debería haber fallado"); 
    } catch (err: any) {
      expect(err.errors.customer_name).toBeDefined();
      expect(err.errors.item).toBeDefined();
      expect(err.errors.quantity).toBeDefined();
    }
  });
});
