import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Truck } from "lucide-react";
import { formatDateTime } from "../../lib/utils";

export function AdminOrders() {
  const orders = useStore((state) => state.orders);
  const clients = useStore((state) => state.clients);
  const drivers = useStore((state) => state.drivers);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDIENTE': return 'bg-slate-800 text-slate-300';
      case 'ASIGNADA': return 'bg-blue-900/50 text-blue-400';
      case 'EN_RUTA': return 'bg-amber-900/50 text-amber-400';
      case 'EN_PROGRESO': return 'bg-orange-900/50 text-orange-400';
      case 'COMPLETADA': return 'bg-emerald-900/50 text-emerald-400';
      case 'CANCELADA': return 'bg-red-900/50 text-red-400';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clients.find(c => c.id === o.clientId)?.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Órdenes de Recolección</h2>
          <p className="text-slate-400 text-sm">Gestiona y monitorea todas las órdenes operativas</p>
        </div>
        <button 
          onClick={() => navigate("/admin/ordenes/nueva")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Orden
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar por folio o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">Folio</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Fecha/Hora</th>
                <th className="px-4 py-3 font-medium">Chofer</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map(order => {
                const client = clients.find(c => c.id === order.clientId);
                const driver = drivers.find(d => d.id === order.driverId);
                return (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{order.folio}</td>
                    <td className="px-4 py-3">
                      <p className="text-white">{client?.businessName}</p>
                      <p className="text-xs text-slate-500">{client?.locations.find(l => l.id === order.locationId)?.name}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <p>{order.scheduledDate}</p>
                      <p className="text-xs text-slate-500">{order.scheduledTime}</p>
                    </td>
                    <td className="px-4 py-3">
                      {driver ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Truck className="w-4 h-4 text-slate-500" />
                          {driver.name}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron órdenes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
