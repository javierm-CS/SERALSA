import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Package, MapPin, Clock, ArrowRight } from "lucide-react";
import { formatDateTime } from "../../lib/utils";

export function OperatorDashboard() {
  const currentUser = useStore((state) => state.currentUser);
  const orders = useStore((state) => state.orders);
  const clients = useStore((state) => state.clients);
  const navigate = useNavigate();

  // Get orders for this driver
  const myOrders = orders.filter(o => o.driverId === currentUser?.driverId);
  const pendingOrders = myOrders.filter(o => ["ASIGNADA", "PENDIENTE"].includes(o.status));
  const inProgressOrder = myOrders.find(o => ["EN_RUTA", "EN_PROGRESO"].includes(o.status));
  const completedToday = myOrders.filter(o => 
    o.status === "COMPLETADA" && 
    o.scheduledDate === new Date().toISOString().split('T')[0]
  );

  const nextOrder = inProgressOrder || pendingOrders[0];
  const nextClient = nextOrder ? clients.find(c => c.id === nextOrder.clientId) : null;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white">Hola, {currentUser?.name?.split(' ')[0]}</h2>
        <p className="text-slate-400">Resumen de tu ruta de hoy</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{pendingOrders.length}</p>
          <p className="text-xs text-slate-400 mt-1">Pendientes</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{inProgressOrder ? 1 : 0}</p>
          <p className="text-xs text-slate-400 mt-1">En Curso</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{completedToday.length}</p>
          <p className="text-xs text-slate-400 mt-1">Completadas</p>
        </div>
      </div>

      {nextOrder && nextClient ? (
        <div className="bg-blue-600 rounded-2xl p-1 shadow-lg shadow-blue-900/20">
          <div className="bg-slate-900 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-md">
                {inProgressOrder ? "EN CURSO" : "SIGUIENTE PARADA"}
              </span>
              <span className="text-slate-400 text-sm">{nextOrder.scheduledTime}</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{nextClient.businessName}</h3>
            <div className="flex items-start gap-2 text-slate-400 text-sm mb-6">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{nextClient.locations.find(l => l.id === nextOrder.locationId)?.address}</p>
            </div>

            <button 
              onClick={() => navigate(`/operador/ordenes/${nextOrder.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Ver Detalles
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No hay órdenes pendientes</h3>
          <p className="text-slate-400 text-sm">Has completado tu ruta de hoy.</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Próximas Paradas</h3>
        <div className="space-y-3">
          {pendingOrders.slice(inProgressOrder ? 0 : 1).map(order => {
            const client = clients.find(c => c.id === order.clientId);
            return (
              <div 
                key={order.id}
                onClick={() => navigate(`/operador/ordenes/${order.id}`)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-400 mb-0.5" />
                  <span className="text-xs font-medium text-white">{order.scheduledTime}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{client?.businessName}</p>
                  <p className="text-xs text-slate-400 truncate">{order.expectedMaterials.join(', ')}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600" />
              </div>
            );
          })}
          {pendingOrders.length === (inProgressOrder ? 0 : 1) && (
            <p className="text-center text-slate-500 text-sm py-4">No hay más paradas programadas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
