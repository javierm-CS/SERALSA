import { NavLink } from "react-router-dom";
import { useStore } from "../../store";
import { 
  LayoutDashboard, 
  Package, 
  Map, 
  Users, 
  Truck, 
  FileText, 
  Settings,
  LogOut,
  MessageSquare
} from "lucide-react";
import { cn } from "../../lib/utils";

export function Sidebar() {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);

  if (!currentUser) return null;

  const getLinks = () => {
    switch (currentUser.role) {
      case "ADMIN":
        return [
          { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/admin/ordenes", icon: Package, label: "Órdenes" },
          { to: "/admin/rutas", icon: Map, label: "Rutas" },
          { to: "/admin/clientes", icon: Users, label: "Clientes" },
          { to: "/admin/choferes", icon: Truck, label: "Choferes" },
          { to: "/admin/reportes", icon: FileText, label: "Reportes" },
          { to: "/admin/chat-ia", icon: MessageSquare, label: "Asistente IA" },
          { to: "/admin/configuracion", icon: Settings, label: "Configuración" },
        ];
      case "LOGISTICA":
        return [
          { to: "/logistica/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/logistica/ordenes", icon: Package, label: "Órdenes" },
          { to: "/logistica/rutas", icon: Map, label: "Rutas" },
          { to: "/logistica/clientes", icon: Users, label: "Clientes" },
          { to: "/logistica/choferes", icon: Truck, label: "Choferes" },
          { to: "/logistica/reportes", icon: FileText, label: "Reportes" },
          { to: "/logistica/chat-ia", icon: MessageSquare, label: "Asistente IA" },
        ];
      case "CLIENTE":
        return [
          { to: "/cliente/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/cliente/ordenes", icon: Package, label: "Mis Órdenes" },
          { to: "/cliente/reportes", icon: FileText, label: "Reportes" },
          { to: "/cliente/chat-ia", icon: MessageSquare, label: "Asistente IA" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-6 flex items-center justify-center border-b border-slate-800/50">
        <img 
          src="https://seralsa.com.mx/wp-content/uploads/2019/08/Logo-Seralsa-sin-slogan-272x90.png" 
          alt="SeralSa Logo" 
          className="h-8 object-contain"
        />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
