import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { ArrowLeft, Save, Truck } from "lucide-react";
import { generateId } from "../../lib/utils";

export function AdminCreateDriver() {
  const navigate = useNavigate();
  const addDriver = useStore((state) => state.addDriver);
  const vehicles = useStore((state) => state.vehicles);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !licenseNumber) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    addDriver({
      id: generateId(),
      name,
      phone,
      email: "nuevo@seralsa.mx", // Mock email
      employeeNumber: `OP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      licenseNumber,
      vehicleId: vehicleId || undefined,
      rating: 5.0,
      status: "DISPONIBLE"
    });

    navigate("/admin/choferes");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nuevo Chofer</h2>
          <p className="text-slate-400 text-sm">Registra un nuevo operador en el sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Nombre del operador"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono *</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="10 dígitos"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Número de Licencia *</label>
              <input 
                type="text" 
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej. A12345678"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 pt-4">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Asignación de Vehículo</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Vehículo Asignado (Opcional)</label>
            <select 
              value={vehicleId} 
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Sin vehículo asignado</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.plates} - {v.model}</option>)}
            </select>
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
            Guardar Chofer
          </button>
        </div>
      </form>
    </div>
  );
}
