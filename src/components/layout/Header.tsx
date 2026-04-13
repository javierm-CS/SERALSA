import { useStore } from "../../store";
import { Bell, Menu, UserCircle } from "lucide-react";

export function Header() {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white hidden md:block">
          {currentUser?.role === "ADMIN" && "Panel de Administración"}
          {currentUser?.role === "LOGISTICA" && "Centro de Logística"}
          {currentUser?.role === "OPERADOR" && "Portal del Operador"}
          {currentUser?.role === "CLIENTE" && "Portal de Cliente"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">{currentUser?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <UserCircle className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
