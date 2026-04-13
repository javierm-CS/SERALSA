import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { generateId } from "../../lib/utils";

export function AdminCreateRoute() {
  const navigate = useNavigate();
  const drivers = useStore((state) => state.drivers);
  const vehicles = useStore((state) => state.vehicles);
  const addRoute = useStore((state) => state.addRoute);

  const [name, setName] = useState("Ruta Centro - Recolección Matutina");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !driverId || !vehicleId) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    addRoute({
      id: generateId(),
      name,
      date,
      driverId,
      vehicleId,
      status: "PENDIENTE",
      orderIds: [], // In a real app, we would select orders here
      estimatedDistanceKm: 25
    });

    navigate("/admin/rutas");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nueva Ruta</h2>
          <p className="text-slate-400 text-sm">Planifica una nueva ruta de recolección</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre de la Ruta *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Fecha *</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Chofer *</label>
              <select 
                value={driverId} 
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecciona un chofer</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Vehículo *</label>
              <select 
                value={vehicleId} 
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecciona un vehículo</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.plates} - {v.model}</option>)}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Mapa y Coordenadas (Pre-llenado)</h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                  {/* Mock Map Image */}
                  <img 
                    src="https://picsum.photos/seed/map/800/400?blur=2" 
                    alt="Mapa de Ruta" 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-white">Ruta Trazada: 25 km</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 space-y-4">
                <h4 className="text-sm font-medium text-slate-300">Paradas Sugeridas</h4>
                <div className="space-y-2">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500">1. Inicio (Base SeralSa)</p>
                    <p className="text-sm text-white">25.6866, -100.3161</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500">2. Cliente A</p>
                    <p className="text-sm text-white">25.6900, -100.3200</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500">3. Cliente B</p>
                    <p className="text-sm text-white">25.7000, -100.3300</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Ruta
          </button>
        </div>
      </form>
    </div>
  );
}
