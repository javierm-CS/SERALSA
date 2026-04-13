/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./pages/public/Login";
import { AppShell } from "./components/layout/AppShell";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminCreateOrder } from "./pages/admin/CreateOrder";
import { AdminRoutes } from "./pages/admin/Routes";
import { AdminCreateRoute } from "./pages/admin/CreateRoute";
import { AdminClients } from "./pages/admin/Clients";
import { AdminCreateClient } from "./pages/admin/CreateClient";
import { AdminDrivers } from "./pages/admin/Drivers";
import { AdminCreateDriver } from "./pages/admin/CreateDriver";
import { AdminReports } from "./pages/admin/Reports";

// Operator Pages
import { OperatorDashboard } from "./pages/operator/Dashboard";
import { OperatorOrders } from "./pages/operator/Orders";
import { OperatorOrderDetail } from "./pages/operator/OrderDetail";
import { OperatorEvidence } from "./pages/operator/Evidence";
import { OperatorSignature } from "./pages/operator/Signature";
import { OperatorHistory } from "./pages/operator/History";

// Client Pages
import { ClientDashboard } from "./pages/client/Dashboard";
import { ClientRequest } from "./pages/client/Request";
import { ClientReportDetail } from "./pages/client/ReportDetail";
import { ClientOrders } from "./pages/client/Orders";
import { ClientReports } from "./pages/client/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "LOGISTICA"]} />}>
          <Route element={<AppShell />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/ordenes" element={<AdminOrders />} />
            <Route path="/admin/ordenes/nueva" element={<AdminCreateOrder />} />
            <Route path="/admin/rutas" element={<AdminRoutes />} />
            <Route path="/admin/rutas/nueva" element={<AdminCreateRoute />} />
            <Route path="/admin/clientes" element={<AdminClients />} />
            <Route path="/admin/clientes/nuevo" element={<AdminCreateClient />} />
            <Route path="/admin/choferes" element={<AdminDrivers />} />
            <Route path="/admin/choferes/nuevo" element={<AdminCreateDriver />} />
            <Route path="/admin/reportes" element={<AdminReports />} />
            <Route path="/admin/reportes/:id" element={<ClientReportDetail />} />
            
            <Route path="/logistica/dashboard" element={<AdminDashboard />} />
            <Route path="/logistica/ordenes" element={<AdminOrders />} />
            <Route path="/logistica/ordenes/nueva" element={<AdminCreateOrder />} />
            <Route path="/logistica/rutas" element={<AdminRoutes />} />
            <Route path="/logistica/rutas/nueva" element={<AdminCreateRoute />} />
            <Route path="/logistica/clientes" element={<AdminClients />} />
            <Route path="/logistica/clientes/nuevo" element={<AdminCreateClient />} />
            <Route path="/logistica/choferes" element={<AdminDrivers />} />
            <Route path="/logistica/choferes/nuevo" element={<AdminCreateDriver />} />
            <Route path="/logistica/reportes" element={<AdminReports />} />
            <Route path="/logistica/reportes/:id" element={<ClientReportDetail />} />
            {/* Add more admin routes here */}
          </Route>
        </Route>

        {/* Operator Routes */}
        <Route element={<ProtectedRoute allowedRoles={["OPERADOR"]} />}>
          <Route element={<AppShell />}>
            <Route path="/operador/dashboard" element={<OperatorDashboard />} />
            <Route path="/operador/ordenes" element={<OperatorOrders />} />
            <Route path="/operador/ordenes/:id" element={<OperatorOrderDetail />} />
            <Route path="/operador/ordenes/:id/evidencia" element={<OperatorEvidence />} />
            <Route path="/operador/ordenes/:id/firma" element={<OperatorSignature />} />
            <Route path="/operador/historial" element={<OperatorHistory />} />
          </Route>
        </Route>

        {/* Client Routes */}
        <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
          <Route element={<AppShell />}>
            <Route path="/cliente/dashboard" element={<ClientDashboard />} />
            <Route path="/cliente/ordenes" element={<ClientOrders />} />
            <Route path="/cliente/solicitudes/nueva" element={<ClientRequest />} />
            <Route path="/cliente/reportes" element={<ClientReports />} />
            <Route path="/cliente/reportes/:id" element={<ClientReportDetail />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
