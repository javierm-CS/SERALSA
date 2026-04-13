import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { ArrowLeft, Send } from "lucide-react";
import { MATERIALS_LIST } from "../../lib/seed";
import { generateId } from "../../lib/utils";

export function ClientRequest() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const client = useStore((state) => state.clients.find(c => c.id === currentUser?.clientId));
  const addRequest = useStore((state) => state.addRequest);

  const [locationId, setLocationId] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [estimatedMaterials, setEstimatedMaterials] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  if (!client) return null;

  const handleMaterialToggle = (mat: string) => {
    if (estimatedMaterials.includes(mat)) {
      setEstimatedMaterials(estimatedMaterials.filter(m => m !== mat));
    } else {
      setEstimatedMaterials([...estimatedMaterials, mat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId || !requestedDate || estimatedMaterials.length === 0) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    addRequest({
      id: generateId(),
      clientId: client.id,
      locationId,
      requestedDate,
      estimatedMaterials,
      notes,
      status: "PENDIENTE",
      createdAt: new Date().toISOString()
    });

    alert("Solicitud enviada exitosamente. Nuestro equipo de logística la revisará pronto.");
    navigate("/cliente/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Solicitar Recolección</h2>
          <p className="text-slate-400 text-sm">Programa una nueva recolección en tus instalaciones</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ubicación *</label>
            <select 
              value={locationId} 
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecciona una ubicación</option>
              {client.locations.map(l => <option key={l.id} value={l.id}>{l.name} - {l.address}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Fecha Deseada *</label>
            <input 
              type="date" 
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Materiales a Recolectar *</label>
            <div className="flex flex-wrap gap-3">
              {MATERIALS_LIST.map(mat => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleMaterialToggle(mat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    estimatedMaterials.includes(mat) 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Notas Adicionales</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              placeholder="Ej. Volumen aproximado, horarios de acceso, etc."
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
            <Send className="w-4 h-4" />
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
