import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, History, MessageSquare } from "lucide-react";
import { cn } from "../../lib/utils";

export function MobileNav() {
  const links = [
    { to: "/operador/dashboard", icon: LayoutDashboard, label: "Inicio" },
    { to: "/operador/ordenes", icon: Package, label: "Órdenes" },
    { to: "/operador/historial", icon: History, label: "Historial" },
    { to: "/operador/chat-ia", icon: MessageSquare, label: "Asistente" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              )
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
