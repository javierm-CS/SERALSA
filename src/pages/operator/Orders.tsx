import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Search, Package, MapPin, Clock, ArrowRight } from "lucide-react";

export function OperatorOrders() {
  const currentUser = useStore((state) => state.currentUser);
  const orders = useStore((state) => state.orders);
  const clients = useStore((state) => state.clients);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const myOrders = orders.filter(o => o.driverId === currentUser?.driverId);
  const filteredOrders = myOrders.filter(o => 
    o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clients.find(c => c.id === o.clientId)?.businessName.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Mis Órdenes</h2>
        <p className="text-slate-400 text-sm">Listado de recolecciones asignadas</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input 
          type="text"
          placeholder="Buscar por folio o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.map(order => {
          const client = clients.find(c => c.id === order.clientId);
          const location = client?.locations.find(l => l.id === order.locationId);
          return (
            <div 
              key={order.id}
              onClick={() => navigate(`/operador/ordenes/${order.id}`)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-slate-400 text-xs">{order.folio}</span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{client?.businessName}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{location?.address}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="w-4 h-4 shrink-0" />
                  <p>{order.scheduledDate} a las {order.scheduledTime}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Package className="w-4 h-4" />
                  <span>{order.expectedMaterials.length} materiales</span>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <Package className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No se encontraron órdenes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
