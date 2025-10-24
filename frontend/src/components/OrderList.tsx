import { useEffect, useState } from "react";
import { Order, PaginatedOrders } from "@shared/types";
import { getOrders, deleteOrder } from "../api/orders";
import { OrderForm } from "./OrderForm";

export const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchOrders = async (page: number, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedOrders = await getOrders(page, pageSize, status);
      setOrders(data.data);
      setTotal(data.total);
    } catch {
      setError("Error cargando las órdenes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, statusFilter || undefined);
  }, [page, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta orden?")) return;
    try {
      await deleteOrder(id);
      fetchOrders(page, statusFilter || undefined);
    } catch {
      setError("Error al eliminar la orden.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Órdenes</h1>

      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium text-gray-700">Filtrar por estado:</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
        >
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {creating && (
        <OrderForm
          onSuccess={() => { setCreating(false); fetchOrders(page, statusFilter || undefined); }}
          onCancel={() => setCreating(false)}
        />
      )}

      {editingOrderId && (
        <OrderForm
          orderId={editingOrderId}
          onSuccess={() => { setEditingOrderId(null); fetchOrders(page, statusFilter || undefined); }}
          onCancel={() => setEditingOrderId(null)}
        />
      )}

      {!creating && !editingOrderId && (
        <>
          <button
            className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
            onClick={() => setCreating(true)}
          >
            + Crear Nueva Orden
          </button>

          {loading && <p className="text-gray-500 mb-2">Cargando órdenes...</p>}
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.quantity}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      order.status === "pending" ? "text-yellow-600" :
                      order.status === "completed" ? "text-green-600" :
                      "text-red-600"
                    }`}>
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                        onClick={() => setEditingOrderId(order.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        onClick={() => handleDelete(order.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 transition"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">Página {page} de {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 transition"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
