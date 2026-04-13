import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { History, FileText, ArrowRight } from "lucide-react";

export function OperatorHistory() {
  const currentUser = useStore((state) => state.currentUser);
  const orders = useStore((state) => state.orders);
  const clients = useStore((state) => state.clients);
  const navigate = useNavigate();

  const myOrders = orders.filter(o => o.driverId === currentUser?.driverId && o.status === "COMPLETADA");

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Historial</h2>
        <p className="text-slate-400 text-sm">Tus recolecciones completadas</p>
      </div>

      <div className="space-y-4">
        {myOrders.map(order => {
          const client = clients.find(c => c.id === order.clientId);
          const totalKg = (order.collectedMaterials || []).reduce((acc, m) => acc + m.weightKg, 0);
          return (
            <div 
              key={order.id}
              onClick={() => navigate(`/operador/ordenes/${order.id}`)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 text-xs">{order.folio}</span>
                <span className="text-emerald-400 text-xs font-medium">{order.completedAt ? new Date(order.completedAt).toLocaleDateString('es-MX') : order.scheduledDate}</span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{client?.businessName}</h3>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium text-emerald-400">{totalKg} kg recolectados</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          );
        })}
        {myOrders.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <History className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No tienes recolecciones completadas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
