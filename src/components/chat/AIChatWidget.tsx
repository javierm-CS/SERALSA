import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User as UserIcon } from "lucide-react";
import { useStore } from "../../store";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hola, soy el asistente de SeralSa. ¿En qué te puedo ayudar hoy?", sender: "ai", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useStore((state) => state.currentUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock AI Response based on role
    setTimeout(() => {
      let aiResponse = "Entendido. Procesando tu solicitud...";
      const lowerInput = userMsg.text.toLowerCase();

      if (currentUser?.role === "ADMIN" || currentUser?.role === "LOGISTICA") {
        if (lowerInput.includes("pendientes") || lowerInput.includes("ordenes")) {
          aiResponse = "Actualmente hay 2 órdenes pendientes y 1 en curso. La unidad CTR-112-C está en ruta hacia Ternium.";
        } else if (lowerInput.includes("chofer")) {
          aiResponse = "Miguel Hernández está activo en la Ruta Norte. José Luis Ramírez está disponible.";
        }
      } else if (currentUser?.role === "OPERADOR") {
        if (lowerInput.includes("siguiente") || lowerInput.includes("parada")) {
          aiResponse = "Tu siguiente parada es HEB Centro Distribución. Tienes programada la recolección de Cartón y Plástico.";
        }
      } else if (currentUser?.role === "CLIENTE") {
        if (lowerInput.includes("recoleccion") || lowerInput.includes("cuando")) {
          aiResponse = "Tienes una recolección programada para hoy a las 16:00 hrs para Tarimas.";
        } else if (lowerInput.includes("reporte") || lowerInput.includes("kilos")) {
          aiResponse = "Este mes hemos recolectado 5,500 kg de materiales en tus instalaciones. Puedes ver el detalle en la sección de Reportes.";
        }
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), text: aiResponse, sender: "ai", timestamp: new Date() }]);
    }, 1000);
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center transition-transform hover:scale-105 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-800 px-4 py-3 flex justify-between items-center border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Asistente SeralSa</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> En línea
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-blue-600'}`}>
                    {msg.sender === 'user' ? <UserIcon className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
