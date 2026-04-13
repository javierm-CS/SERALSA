import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Package, Map, Users, Truck, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();
  const orders = useStore((state) => state.orders);
  const clients = useStore((state) => state.clients);
  const drivers = useStore((state) => state.drivers);

  const stats = [
    { label: "Órdenes Hoy", value: orders.filter(o => o.scheduledDate === new Date().toISOString().split('T')[0]).length, icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "En Progreso", value: orders.filter(o => o.status === "EN_PROGRESO").length, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Clientes Activos", value: clients.length, icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Choferes Activos", value: drivers.filter(d => d.status !== "NO_DISPONIBLE").length, icon: Truck, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  const materialData = [
    { name: 'Cartón', kg: 4500 },
    { name: 'Plástico', kg: 3200 },
    { name: 'Chatarra', kg: 8500 },
    { name: 'PET', kg: 1200 },
    { name: 'Tarimas', kg: 2100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard General</h2>
          <p className="text-slate-400 text-sm">Resumen operativo y métricas principales</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate("/admin/ordenes/nueva")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Nueva Orden
          </button>
          <button 
            onClick={() => navigate("/admin/reportes")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Generar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Volumen por Material (Últimos 7 días)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="kg" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Incidencias y Alertas</h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Retraso en Ruta Norte</p>
                  <p className="text-xs text-slate-400 mt-1">Unidad CTR-112-C reporta tráfico pesado. ETA +25 min.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
