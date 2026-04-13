import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Search, Package, MapPin, Clock, ArrowRight } from "lucide-react";

export function ClientOrders() {
  const currentUser = useStore((state) => state.currentUser);
  const client = useStore((state) => state.clients.find(c => c.id === currentUser?.clientId));
  const orders = useStore((state) => state.orders.filter(o => o.clientId === client?.id));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  if (!client) return null;

  const filteredOrders = orders.filter(o => 
    o.folio.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Mis Órdenes</h2>
        <p className="text-slate-400 text-sm">Historial y estado de tus recolecciones</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar por folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">Folio</th>
                <th className="px-4 py-3 font-medium">Fecha Programada</th>
                <th className="px-4 py-3 font-medium">Ubicación</th>
                <th className="px-4 py-3 font-medium">Materiales Esperados</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map(order => {
                const location = client.locations.find(l => l.id === order.locationId);
                return (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{order.folio}</td>
                    <td className="px-4 py-3 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {order.scheduledDate} {order.scheduledTime}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {location?.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {order.expectedMaterials.join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {order.status === "COMPLETADA" && (
                        <button 
                          onClick={() => navigate(`/cliente/reportes/${order.id}`)}
                          className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded inline-flex items-center gap-1"
                        >
                          Ver Reporte
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
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
