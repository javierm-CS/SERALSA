import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import { generateId } from "../../lib/utils";

export function AdminCreateClient() {
  const navigate = useNavigate();
  const addClient = useStore((state) => state.addClient);

  const [businessName, setBusinessName] = useState("");
  const [rfc, setRfc] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !rfc || !contactName) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    addClient({
      id: generateId(),
      businessName,
      rfc,
      contactName,
      email: contactEmail,
      phone: contactPhone,
      address,
      totalCollectedKg: 0,
      locations: [
        {
          id: generateId(),
          name: "Planta Principal",
          address,
          lat: 25.6866,
          lng: -100.3161
        }
      ],
      frequentMaterials: ["Cartón", "Plástico"],
      status: "ACTIVO"
    });

    navigate("/admin/clientes");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nuevo Cliente</h2>
          <p className="text-slate-400 text-sm">Registra una nueva empresa en el sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Información Fiscal y Comercial</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Razón Social *</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej. Industrias S.A. de C.V."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">RFC *</label>
              <input 
                type="text" 
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="ABC123456T1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Dirección Principal *</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Calle, Número, Colonia, Ciudad, Estado, CP"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 pt-4">
            <h3 className="text-lg font-medium text-white">Contacto Principal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Contacto *</label>
              <input 
                type="text" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="contacto@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
              <input 
                type="tel" 
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="10 dígitos"
              />
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
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}
