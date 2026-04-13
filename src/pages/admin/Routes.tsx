import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Plus, Search, Map, MoreVertical, Edit, Eye } from "lucide-react";

export function AdminRoutes() {
  const routes = useStore((state) => state.routes);
  const drivers = useStore((state) => state.drivers);
  const vehicles = useStore((state) => state.vehicles);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDIENTE': return 'bg-slate-800 text-slate-300';
      case 'ACTIVA': return 'bg-blue-900/50 text-blue-400';
      case 'COMPLETADA': return 'bg-emerald-900/50 text-emerald-400';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Rutas de Recolección</h2>
          <p className="text-slate-400 text-sm">Gestiona y planea las rutas diarias</p>
        </div>
        <button 
          onClick={() => navigate("/admin/rutas/nueva")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Ruta
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar por nombre de ruta..."
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
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Chofer / Vehículo</th>
                <th className="px-4 py-3 font-medium">Paradas</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRoutes.map(route => {
                const driver = drivers.find(d => d.id === route.driverId);
                const vehicle = vehicles.find(v => v.id === route.vehicleId);
                return (
                  <tr key={route.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-blue-400" />
                        {route.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{route.date}</td>
                    <td className="px-4 py-3">
                      <p className="text-white">{driver?.name}</p>
                      <p className="text-xs text-slate-500">{vehicle?.plates}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{route.orderIds.length} paradas</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(route.status)}`}>
                        {route.status}
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
              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron rutas.
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
