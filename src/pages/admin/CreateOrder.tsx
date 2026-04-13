import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { ArrowLeft, Save } from "lucide-react";
import { MATERIALS_LIST } from "../../lib/seed";
import { generateId } from "../../lib/utils";
import { Order } from "../../types";

export function AdminCreateOrder() {
  const navigate = useNavigate();
  const clients = useStore((state) => state.clients);
  const drivers = useStore((state) => state.drivers);
  const vehicles = useStore((state) => state.vehicles);
  const addOrder = useStore((state) => state.addOrder);

  const [clientId, setClientId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState("08:00");
  const [serviceType, setServiceType] = useState("Recolección Programada");
  const [expectedMaterials, setExpectedMaterials] = useState<string[]>([]);
  const [priority, setPriority] = useState<"ALTA" | "MEDIA" | "BAJA">("MEDIA");
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const selectedClient = clients.find(c => c.id === clientId);

  const handleMaterialToggle = (mat: string) => {
    if (expectedMaterials.includes(mat)) {
      setExpectedMaterials(expectedMaterials.filter(m => m !== mat));
    } else {
      setExpectedMaterials([...expectedMaterials, mat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !locationId || expectedMaterials.length === 0) {
      alert("Por favor completa los campos obligatorios (Cliente, Ubicación y al menos un material).");
      return;
    }

    const newOrder: Order = {
      id: generateId(),
      folio: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      clientId,
      locationId,
      scheduledDate,
      scheduledTime,
      serviceType,
      expectedMaterials,
      status: driverId ? "ASIGNADA" : "PENDIENTE",
      priority,
      internalNotes,
      driverId: driverId || undefined,
      vehicleId: vehicleId || undefined,
      collectedMaterials: []
    };

    addOrder(newOrder);
    navigate("/admin/ordenes");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nueva Orden</h2>
          <p className="text-slate-400 text-sm">Crear una nueva orden de recolección</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-8">
          
          {/* Cliente y Ubicación */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">1. Cliente y Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cliente *</label>
                <select 
                  value={clientId} 
                  onChange={(e) => { setClientId(e.target.value); setLocationId(""); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.businessName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ubicación *</label>
                <select 
                  value={locationId} 
                  onChange={(e) => setLocationId(e.target.value)}
                  disabled={!clientId}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  required
                >
                  <option value="">Selecciona una ubicación</option>
                  {selectedClient?.locations.map(l => <option key={l.id} value={l.id}>{l.name} - {l.address}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Programación */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">2. Programación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fecha *</label>
                <input 
                  type="date" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hora *</label>
                <input 
                  type="time" 
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prioridad</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>
          </div>

          {/* Materiales */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">3. Materiales Esperados *</h3>
            <div className="flex flex-wrap gap-3">
              {MATERIALS_LIST.map(mat => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleMaterialToggle(mat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    expectedMaterials.includes(mat) 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Asignación (Opcional) */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">4. Asignación (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Chofer</label>
                <select 
                  value={driverId} 
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Vehículo</label>
                <select 
                  value={vehicleId} 
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.plates} - {v.model}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">5. Notas Internas</h3>
            <textarea 
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              placeholder="Instrucciones especiales para el operador o logística..."
            />
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
            Crear Orden
          </button>
        </div>
      </form>
    </div>
  );
}
