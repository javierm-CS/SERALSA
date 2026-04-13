import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { useStore } from "../../store";
import { AIChatWidget } from "../chat/AIChatWidget";

export function AppShell() {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) return null;

  const isOperator = currentUser.role === "OPERADOR";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      {!isOperator && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 relative">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation for Operators */}
      {isOperator && <MobileNav />}
      
      {/* Global Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
