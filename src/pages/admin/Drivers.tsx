import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Plus, Search, Truck, MoreVertical, Edit, Eye, Star } from "lucide-react";

export function AdminDrivers() {
  const drivers = useStore((state) => state.drivers);
  const vehicles = useStore((state) => state.vehicles);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DISPONIBLE': return 'bg-emerald-900/50 text-emerald-400';
      case 'EN_RUTA': return 'bg-blue-900/50 text-blue-400';
      case 'NO_DISPONIBLE': return 'bg-slate-800 text-slate-400';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Choferes y Operadores</h2>
          <p className="text-slate-400 text-sm">Gestiona el personal operativo y sus vehículos</p>
        </div>
        <button 
          onClick={() => navigate("/admin/choferes/nuevo")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Chofer
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar por nombre o número de empleado..."
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
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Vehículo Asignado</th>
                <th className="px-4 py-3 font-medium">Calificación</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDrivers.map(driver => {
                const vehicle = vehicles.find(v => v.id === driver.vehicleId);
                return (
                  <tr key={driver.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{driver.name}</p>
                      <p className="text-xs text-slate-500">{driver.employeeNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300">{driver.phone}</p>
                      <p className="text-xs text-slate-500">{driver.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {vehicle ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Truck className="w-4 h-4 text-slate-500" />
                          <div>
                            <p>{vehicle.plates}</p>
                            <p className="text-[10px] text-slate-500">{vehicle.model}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{driver.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(driver.status)}`}>
                        {driver.status.replace('_', ' ')}
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
              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron choferes.
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
