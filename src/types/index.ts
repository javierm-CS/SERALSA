export type Role = "ADMIN" | "LOGISTICA" | "OPERADOR" | "CLIENTE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  clientId?: string; // If role is CLIENTE
  driverId?: string; // If role is OPERADOR
}

export interface Client {
  id: string;
  businessName: string;
  rfc?: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  locations: Location[];
  frequentMaterials: string[];
  status: "ACTIVO" | "INACTIVO";
  totalCollectedKg: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  employeeNumber: string;
  licenseNumber?: string;
  vehicleId?: string;
  status: "DISPONIBLE" | "EN_RUTA" | "NO_DISPONIBLE";
  rating: number;
}

export interface Vehicle {
  id: string;
  plates: string;
  model: string;
  capacity: string;
}

export type OrderStatus = "PENDIENTE" | "ASIGNADA" | "EN_RUTA" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";

export interface MaterialWeight {
  material: string;
  weightKg: number;
}

export interface Order {
  id: string;
  folio: string;
  clientId: string;
  locationId: string;
  scheduledDate: string; // ISO string
  scheduledTime: string; // HH:mm
  serviceType: string;
  expectedMaterials: string[];
  status: OrderStatus;
  priority: "ALTA" | "MEDIA" | "BAJA";
  internalNotes?: string;
  
  driverId?: string;
  vehicleId?: string;
  routeId?: string;

  // Execution data
  startedAt?: string;
  arrivedAt?: string;
  arrivalLat?: number;
  arrivalLng?: number;
  
  evidenceBeforeUrl?: string;
  evidenceAfterUrl?: string;
  
  collectedMaterials: MaterialWeight[];
  operatorObservations?: string;
  
  operatorSignatureUrl?: string;
  clientSignatureUrl?: string;
  
  completedAt?: string;
}

export interface Route {
  id: string;
  name: string;
  date: string;
  driverId: string;
  vehicleId: string;
  status: "PENDIENTE" | "ACTIVA" | "COMPLETADA";
  orderIds: string[]; // Ordered list of stops
  estimatedDistanceKm?: number;
}

export interface CustomerRequest {
  id: string;
  clientId: string;
  locationId: string;
  requestedDate: string;
  estimatedMaterials: string[];
  notes?: string;
  status: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  createdAt: string;
}

export interface EnvironmentalImpact {
  treesSaved: number;
  co2AvoidedKg: number;
  waterSavedLiters: number;
}
