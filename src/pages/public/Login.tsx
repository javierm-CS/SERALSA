import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa correo y contraseña.");
      return;
    }
    
    login(email);
    const user = useStore.getState().currentUser;
    
    if (user) {
      redirectUser(user.role);
    } else {
      setError("Credenciales incorrectas.");
    }
  };

  const redirectUser = (role: string) => {
    switch (role) {
      case "ADMIN": navigate("/admin/dashboard"); break;
      case "LOGISTICA": navigate("/logistica/dashboard"); break;
      case "OPERADOR": navigate("/operador/dashboard"); break;
      case "CLIENTE": navigate("/cliente/dashboard"); break;
      default: navigate("/");
    }
  };

  const demoLogin = (demoEmail: string) => {
    login(demoEmail);
    const user = useStore.getState().currentUser;
    if (user) redirectUser(user.role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/logistics/1920/1080')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img 
              src="https://seralsa.com.mx/wp-content/uploads/2019/08/Logo-Seralsa-sin-slogan-272x90.png" 
              alt="SeralSa Logo" 
              className="h-12 object-contain"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2">Bienvenido</h2>
          <p className="text-slate-400 text-center mb-8">Plataforma de Recolección y Logística</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="usuario@seralsa.mx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-300">
                <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500" />
                Recordarme
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        <div className="bg-slate-950/50 px-8 py-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-4 text-center uppercase tracking-wider font-semibold">Accesos Rápidos Demo</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => demoLogin("admin@seralsa.mx")} className="text-xs py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">Admin</button>
            <button onClick={() => demoLogin("logistica@seralsa.mx")} className="text-xs py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">Logística</button>
            <button onClick={() => demoLogin("miguel@seralsa.mx")} className="text-xs py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">Operador</button>
            <button onClick={() => demoLogin("ternium@cliente.mx")} className="text-xs py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">Cliente</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
