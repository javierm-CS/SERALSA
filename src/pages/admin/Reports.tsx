import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Search, FileText, Download, Eye } from "lucide-react";

export function AdminReports() {
  const orders = useStore((state) => state.orders.filter(o => o.status === "COMPLETADA"));
  const clients = useStore((state) => state.clients);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(o => 
    o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clients.find(c => c.id === o.clientId)?.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Reportes Operativos</h2>
          <p className="text-slate-400 text-sm">Consulta y exporta los reportes de recolecciones completadas</p>
        </div>
        <button 
          onClick={() => alert("Exportar a Excel - Funcionalidad en desarrollo")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar Todo
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar por folio o cliente..."
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
                <th className="px-4 py-3 font-medium">Folio</th>
                <th className="px-4 py-3 font-medium">Fecha Completada</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Materiales (Kg)</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map(order => {
                const client = clients.find(c => c.id === order.clientId);
                const totalKg = (order.collectedMaterials || []).reduce((acc, m) => acc + m.weightKg, 0);
                return (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        {order.folio}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {order.completedAt ? new Date(order.completedAt).toLocaleDateString('es-MX') : order.scheduledDate}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{client?.businessName}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="font-medium text-emerald-400">{totalKg} kg</span>
                      <p className="text-[10px] text-slate-500">{(order.collectedMaterials || []).map(m => m.material).join(', ')}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/reportes/${order.id}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded"
                          title="Ver Reporte"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron reportes.
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
