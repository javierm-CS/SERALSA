import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Package, Leaf, FileText, Plus, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ClientDashboard() {
  const currentUser = useStore((state) => state.currentUser);
  const client = useStore((state) => state.clients.find(c => c.id === currentUser?.clientId));
  const orders = useStore((state) => state.orders.filter(o => o.clientId === client?.id));
  const navigate = useNavigate();

  if (!client) return null;

  const completedOrders = orders.filter(o => o.status === "COMPLETADA");
  const activeOrders = orders.filter(o => ["PENDIENTE", "ASIGNADA", "EN_RUTA", "EN_PROGRESO"].includes(o.status));

  const materialData = [
    { name: 'Cartón', kg: 1500 },
    { name: 'Plástico', kg: 800 },
    { name: 'Chatarra', kg: 3200 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Hola, {client.contactName}</h2>
          <p className="text-slate-400 text-sm">{client.businessName}</p>
        </div>
        <button 
          onClick={() => navigate("/cliente/solicitudes/nueva")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Solicitar Recolección
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-400/10">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Reciclado</p>
            <p className="text-2xl font-bold text-white">{client.totalCollectedKg.toLocaleString()} kg</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-400/10">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Recolecciones Activas</p>
            <p className="text-2xl font-bold text-white">{activeOrders.length}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-400/10">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Reportes Generados</p>
            <p className="text-2xl font-bold text-white">{completedOrders.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Materiales Recolectados (Este Mes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="kg" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Últimas Recolecciones</h3>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {completedOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div>
                  <p className="text-sm font-medium text-slate-200">{order.scheduledDate}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{(order.collectedMaterials || []).reduce((acc, m) => acc + m.weightKg, 0)} kg totales</p>
                </div>
                <button 
                  onClick={() => navigate(`/cliente/reportes/${order.id}`)}
                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {completedOrders.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No hay recolecciones recientes.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-emerald-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          Impacto Ambiental
        </h3>
        <p className="text-slate-300 text-sm mb-4">Gracias a tus esfuerzos de reciclaje este año, has logrado:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">124</p>
            <p className="text-xs text-slate-400 mt-1">Árboles Salvados</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">8,500 kg</p>
            <p className="text-xs text-slate-400 mt-1">CO2 Evitado</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">45,000 L</p>
            <p className="text-xs text-slate-400 mt-1">Agua Ahorrada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
