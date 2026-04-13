import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Camera, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { MATERIALS_LIST } from "../../lib/seed";

export function OperatorEvidence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useStore((state) => state.orders.find(o => o.id === id));
  const updateOrder = useStore((state) => state.updateOrder);

  const [materials, setMaterials] = useState(order?.collectedMaterials || []);
  const [obs, setObs] = useState(order?.operatorObservations || "");
  const [photoBefore, setPhotoBefore] = useState(order?.evidenceBeforeUrl || "");
  const [photoAfter, setPhotoAfter] = useState(order?.evidenceAfterUrl || "");

  if (!order) return null;

  const handleAddMaterial = () => {
    setMaterials([...materials, { material: MATERIALS_LIST[0], weightKg: 0 }]);
  };

  const handleUpdateMaterial = (index: number, field: 'material' | 'weightKg', value: any) => {
    const newMats = [...materials];
    newMats[index] = { ...newMats[index], [field]: field === 'weightKg' ? Number(value) : value };
    setMaterials(newMats);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    let finalMaterials = materials.filter(m => m.weightKg > 0);
    
    // For testing purposes, if no materials were added, add a mock one so the order can be completed
    if (finalMaterials.length === 0) {
      finalMaterials = [{ material: MATERIALS_LIST[0], weightKg: 100 }];
    }

    updateOrder(order.id, {
      collectedMaterials: finalMaterials,
      operatorObservations: obs,
      evidenceBeforeUrl: photoBefore || "https://picsum.photos/seed/mock1/400/300", // Mock photo if empty
      evidenceAfterUrl: photoAfter || "https://picsum.photos/seed/mock2/400/300"
    });
    navigate(`/operador/ordenes/${order.id}`);
  };

  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 rounded-lg text-slate-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">Captura de Evidencia</h2>
      </div>

      <div className="space-y-6">
        {/* Photos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Foto Antes</label>
            <div 
              className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden ${photoBefore ? 'border-blue-500' : 'border-slate-700 bg-slate-900'}`}
              onClick={() => setPhotoBefore("https://picsum.photos/seed/mock1/400/300")}
            >
              {photoBefore ? (
                <img src={photoBefore} alt="Antes" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-slate-500 mb-2" />
                  <span className="text-xs text-slate-500">Tomar Foto</span>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Foto Después</label>
            <div 
              className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden ${photoAfter ? 'border-blue-500' : 'border-slate-700 bg-slate-900'}`}
              onClick={() => setPhotoAfter("https://picsum.photos/seed/mock2/400/300")}
            >
              {photoAfter ? (
                <img src={photoAfter} alt="Después" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-slate-500 mb-2" />
                  <span className="text-xs text-slate-500">Tomar Foto</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Materiales Recolectados</h3>
            <button onClick={handleAddMaterial} className="text-blue-400 hover:text-blue-300 p-1">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {materials.map((mat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select 
                  value={mat.material}
                  onChange={(e) => handleUpdateMaterial(i, 'material', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {MATERIALS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="relative w-24">
                  <input 
                    type="number" 
                    value={mat.weightKg || ''}
                    onChange={(e) => handleUpdateMaterial(i, 'weightKg', e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-500">kg</span>
                </div>
                <button onClick={() => handleRemoveMaterial(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {materials.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-2">No se han agregado materiales.</p>
            )}
          </div>
          
          {materials.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400">Total:</span>
              <span className="font-bold text-white">{materials.reduce((acc, m) => acc + (m.weightKg || 0), 0)} kg</span>
            </div>
          )}
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Observaciones</label>
          <textarea 
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            placeholder="Ej. Material mojado, andén ocupado..."
          />
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 z-10">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            Guardar Evidencia
          </button>
        </div>
      </div>
    </div>
  );
}
