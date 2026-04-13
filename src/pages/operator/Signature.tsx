import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import SignatureCanvas from "react-signature-canvas";
import { ArrowLeft, Eraser, Save } from "lucide-react";

export function OperatorSignature() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useStore((state) => state.orders.find(o => o.id === id));
  const updateOrder = useStore((state) => state.updateOrder);

  const opSigRef = useRef<SignatureCanvas>(null);
  const clientSigRef = useRef<SignatureCanvas>(null);

  const [activeTab, setActiveTab] = useState<"OPERADOR" | "CLIENTE">("OPERADOR");

  if (!order) return null;

  const handleClear = () => {
    if (activeTab === "OPERADOR") opSigRef.current?.clear();
    else clientSigRef.current?.clear();
  };

  const handleSave = () => {
    const updates: any = {};
    if (opSigRef.current && !opSigRef.current.isEmpty()) {
      try {
        updates.operatorSignatureUrl = opSigRef.current.getTrimmedCanvas().toDataURL('image/png');
      } catch (e) {
        console.error("Error trimming operator canvas:", e);
        updates.operatorSignatureUrl = opSigRef.current.getCanvas().toDataURL('image/png');
      }
    } else {
      // Mock signature for testing if empty
      updates.operatorSignatureUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
    
    if (clientSigRef.current && !clientSigRef.current.isEmpty()) {
      try {
        updates.clientSignatureUrl = clientSigRef.current.getTrimmedCanvas().toDataURL('image/png');
      } catch (e) {
        console.error("Error trimming client canvas:", e);
        updates.clientSignatureUrl = clientSigRef.current.getCanvas().toDataURL('image/png');
      }
    } else {
      // Mock signature for testing if empty
      updates.clientSignatureUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
    
    updateOrder(order.id, updates);
    navigate(`/operador/ordenes/${order.id}`);
  };

  return (
    <div className="max-w-md mx-auto pb-24 flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 rounded-lg text-slate-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">Firmas</h2>
      </div>

      <div className="flex bg-slate-900 rounded-lg p-1 mb-6 shrink-0">
        <button 
          onClick={() => setActiveTab("OPERADOR")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "OPERADOR" ? "bg-slate-800 text-white" : "text-slate-400"}`}
        >
          Operador
        </button>
        <button 
          onClick={() => setActiveTab("CLIENTE")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "CLIENTE" ? "bg-slate-800 text-white" : "text-slate-400"}`}
        >
          Cliente / Guardia
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
          <span className="text-sm font-medium text-slate-400">
            {activeTab === "OPERADOR" ? "Firma del Operador" : "Firma del Responsable en Sitio"}
          </span>
          <button onClick={handleClear} className="pointer-events-auto p-2 bg-slate-800/80 backdrop-blur rounded-lg text-slate-300 hover:text-white">
            <Eraser className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 w-full h-full bg-white relative" style={{ display: activeTab === "OPERADOR" ? "block" : "none" }}>
          <SignatureCanvas 
            ref={opSigRef} 
            penColor="black"
            canvasProps={{ className: "w-full h-full absolute inset-0" }} 
          />
        </div>
        <div className="flex-1 w-full h-full bg-white relative" style={{ display: activeTab === "CLIENTE" ? "block" : "none" }}>
          <SignatureCanvas 
            ref={clientSigRef} 
            penColor="black"
            canvasProps={{ className: "w-full h-full absolute inset-0" }} 
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
            Guardar Firmas
          </button>
        </div>
      </div>
    </div>
  );
}
