import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { MapPin, Phone, User, Package, Clock, CheckCircle2, Navigation, Camera } from "lucide-react";
import { formatDateTime } from "../../lib/utils";

export function OperatorOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useStore((state) => state.orders.find(o => o.id === id));
  const client = useStore((state) => state.clients.find(c => c.id === order?.clientId));
  const updateOrder = useStore((state) => state.updateOrder);
  
  const [isLocating, setIsLocating] = useState(false);

  if (!order || !client) return <div className="p-4 text-white">Orden no encontrada</div>;

  const location = client.locations.find(l => l.id === order.locationId);

  const handleStart = () => {
    updateOrder(order.id, { 
      status: "EN_RUTA", 
      startedAt: new Date().toISOString() 
    });
  };

  const handleArrive = () => {
    setIsLocating(true);
    // Simulate GPS fetch
    setTimeout(() => {
      updateOrder(order.id, { 
        status: "EN_PROGRESO", 
        arrivedAt: new Date().toISOString(),
        arrivalLat: 25.6866 + (Math.random() * 0.01),
        arrivalLng: -100.3161 + (Math.random() * 0.01)
      });
      setIsLocating(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Folio: {order.folio}</span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
            order.status === 'PENDIENTE' || order.status === 'ASIGNADA' ? 'bg-slate-800 text-slate-300' :
            order.status === 'EN_RUTA' ? 'bg-blue-500/20 text-blue-400' :
            order.status === 'EN_PROGRESO' ? 'bg-amber-500/20 text-amber-400' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            {order.status}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">{client.businessName}</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">{location?.name}</p>
              <p className="text-sm text-slate-400 mt-1">{location?.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Contacto</p>
              <p className="text-sm font-medium text-white">{client.contactName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Teléfono</p>
              <p className="text-sm font-medium text-white">{client.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-2">Materiales Esperados</p>
              <div className="flex flex-wrap gap-2">
                {order.expectedMaterials.map(mat => (
                  <span key={mat} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 z-10">
        <div className="max-w-md mx-auto">
          {(order.status === "PENDIENTE" || order.status === "ASIGNADA") && (
            <button 
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Iniciar Ruta
            </button>
          )}

          {order.status === "EN_RUTA" && (
            <button 
              onClick={handleArrive}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              <MapPin className="w-5 h-5" />
              {isLocating ? "Obteniendo GPS..." : "He Llegado"}
            </button>
          )}

          {order.status === "EN_PROGRESO" && (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate(`/operador/ordenes/${order.id}/evidencia`)}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-colors ${
                  (order.collectedMaterials?.length || 0) > 0 
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Camera className="w-5 h-5" />
                Evidencia
              </button>
              <button 
                onClick={() => navigate(`/operador/ordenes/${order.id}/firma`)}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-colors ${
                  order.operatorSignatureUrl 
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" 
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Firmas
              </button>
              
              <div className="col-span-2 mt-2">
                 <button 
                  onClick={() => {
                    updateOrder(order.id, { status: "COMPLETADA", completedAt: new Date().toISOString() });
                    navigate("/operador/dashboard");
                  }}
                  disabled={(order.collectedMaterials?.length || 0) === 0 || !order.operatorSignatureUrl}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Completar Orden
                </button>
              </div>
            </div>
          )}

          {order.status === "COMPLETADA" && (
            <div className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 py-3.5 rounded-xl font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Orden Completada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
