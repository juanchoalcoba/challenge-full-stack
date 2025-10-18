import { useState, useEffect, FormEvent } from "react";
import { Order } from "@shared/types";
import { createOrder, updateOrder, getOrder } from "../api/orders";

interface OrderFormProps {
  orderId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const OrderForm = ({ orderId, onSuccess, onCancel }: OrderFormProps) => {
  const [customer_name, setCustomerName] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Order["status"]>("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getOrder(orderId)
      .then((o) => {
        setCustomerName(o.customer_name);
        setItem(o.item);
        setQuantity(o.quantity);
        setStatus(o.status);
      })
      .catch(() => setError("Error cargando la orden"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (orderId) {
        await updateOrder(orderId, { customer_name, item, quantity, status });
      } else {
        await createOrder({ customer_name, item, quantity, status });
      }
      onSuccess();
    } catch {
      setError("Error guardando la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mb-6 p-6 bg-white shadow-xl rounded-xl border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{orderId ? "Editar Orden" : "Crear Orden"}</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="mb-4 text-gray-500">Cargando...</p>}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Cliente:</label>
        <input
          type="text"
          value={customer_name}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Item:</label>
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Cantidad:</label>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Estado:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Order["status"])}
          className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
        >
          {orderId ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};
