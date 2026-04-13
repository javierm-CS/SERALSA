import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { ArrowLeft, Download, FileText, MapPin, Clock, Truck, CheckCircle2, Leaf, Droplets, Wind } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function ClientReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useStore((state) => state.orders.find(o => o.id === id));
  const client = useStore((state) => state.clients.find(c => c.id === order?.clientId));
  const driver = useStore((state) => state.drivers.find(d => d.id === order?.driverId));

  if (!order || !client) return <div className="p-6 text-white">Reporte no encontrado</div>;

  const totalKg = (order.collectedMaterials || []).reduce((acc, m) => acc + m.weightKg, 0);

  // Mock environmental impact calculation
  const treesSaved = (totalKg * 0.015).toFixed(1);
  const waterSaved = (totalKg * 12).toFixed(0);
  const co2Saved = (totalKg * 2.5).toFixed(0);

  const generatePDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a', // slate-950
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Reporte_SeralSa_${order.folio}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Reporte de Recolección</h2>
            <p className="text-slate-400 text-sm">Folio: {order.folio}</p>
          </div>
        </div>
        <button 
          onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar PDF
        </button>
      </div>

      <div id="report-content" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Header Info */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <img 
            src="https://seralsa.com.mx/wp-content/uploads/2019/08/Logo-Seralsa-sin-slogan-272x90.png" 
            alt="SeralSa Logo" 
            className="h-10 object-contain"
          />
          <div className="text-right">
            <h3 className="text-white font-bold text-lg">Manifiesto de Recolección</h3>
            <p className="text-slate-400 text-sm">{order.folio}</p>
          </div>
        </div>

        <div className="p-6 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">Cliente</p>
            <p className="text-sm font-medium text-white">{client.businessName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Fecha Completada</p>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Clock className="w-4 h-4 text-slate-400" />
              {order.completedAt ? new Date(order.completedAt).toLocaleString('es-MX') : order.scheduledDate}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Ubicación</p>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <MapPin className="w-4 h-4 text-slate-400" />
              {client.locations.find(l => l.id === order.locationId)?.name || "Principal"}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Operador</p>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Truck className="w-4 h-4 text-slate-400" />
              {driver?.name || "N/A"}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Materiales y Impacto */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Materiales Recolectados
              </h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="space-y-3">
                  {(order.collectedMaterials || []).map((mat, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-300">{mat.material}</span>
                      <span className="font-medium text-white">{mat.weightKg} kg</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                  <span className="font-medium text-slate-400">Total Recolectado</span>
                  <span className="text-xl font-bold text-emerald-400">{totalKg} kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                Impacto Ambiental
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <Leaf className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{treesSaved}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Árboles</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{waterSaved}L</p>
                  <p className="text-[10px] text-slate-400 uppercase">Agua</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <Wind className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{co2Saved}kg</p>
                  <p className="text-[10px] text-slate-400 uppercase">CO2</p>
                </div>
              </div>
            </div>

            {order.operatorObservations && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Observaciones del Operador</h4>
                <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {order.operatorObservations}
                </p>
              </div>
            )}
          </div>

          {/* Evidencias */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Evidencia Fotográfica
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-2 text-center">Antes</p>
                <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                  {order.evidenceBeforeUrl ? (
                    <img src={order.evidenceBeforeUrl} alt="Antes" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Sin foto</div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2 text-center">Después</p>
                <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                  {order.evidenceAfterUrl ? (
                    <img src={order.evidenceAfterUrl} alt="Después" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Sin foto</div>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">Firmas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-2 h-24 flex items-center justify-center">
                {order.operatorSignatureUrl ? (
                  <img src={order.operatorSignatureUrl} alt="Firma Operador" className="max-h-full max-w-full" crossOrigin="anonymous" />
                ) : (
                  <span className="text-slate-400 text-xs">Sin firma</span>
                )}
              </div>
              <div className="bg-white rounded-lg p-2 h-24 flex items-center justify-center">
                {order.clientSignatureUrl ? (
                  <img src={order.clientSignatureUrl} alt="Firma Cliente" className="max-h-full max-w-full" crossOrigin="anonymous" />
                ) : (
                  <span className="text-slate-400 text-xs">Sin firma</span>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mt-1">Operador</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mt-1">Responsable en Sitio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
