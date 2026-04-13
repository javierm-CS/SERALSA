import { User, Client, Driver, Vehicle, Order, Route, CustomerRequest } from "../types";

export const seedUsers: User[] = [
  { id: "u1", name: "Admin General", email: "admin@seralsa.mx", role: "ADMIN" },
  { id: "u2", name: "Despacho Logística", email: "logistica@seralsa.mx", role: "LOGISTICA" },
  { id: "u3", name: "Miguel Hernández", email: "miguel@seralsa.mx", role: "OPERADOR", driverId: "d1" },
  { id: "u4", name: "José Luis Ramírez", email: "jose.ramirez@seralsa.mx", role: "OPERADOR", driverId: "d2" },
  { id: "u5", name: "Ternium Compras", email: "ternium@cliente.mx", role: "CLIENTE", clientId: "c1" },
  { id: "u6", name: "HEB Operaciones", email: "heb@cliente.mx", role: "CLIENTE", clientId: "c2" },
];

export const seedClients: Client[] = [
  {
    id: "c1",
    businessName: "Ternium México",
    contactName: "Roberto Garza",
    phone: "8123456789",
    email: "ternium@cliente.mx",
    address: "Av. Universidad 1000, San Nicolás",
    locations: [{ id: "l1", name: "Planta Guerrero", address: "Av. Guerrero 151, Mty" }],
    frequentMaterials: ["Chatarra", "Cartón", "Tarimas"],
    status: "ACTIVO",
    totalCollectedKg: 45000,
  },
  {
    id: "c2",
    businessName: "HEB Centro Distribución",
    contactName: "Laura Martínez",
    phone: "8198765432",
    email: "heb@cliente.mx",
    address: "Carr. a Laredo Km 14, Escobedo",
    locations: [{ id: "l2", name: "CEDIS Norte", address: "Carr. a Laredo Km 14, Escobedo" }],
    frequentMaterials: ["Cartón", "Plástico", "PET"],
    status: "ACTIVO",
    totalCollectedKg: 12500,
  },
  {
    id: "c3",
    businessName: "Hotel Camino Real",
    contactName: "Carlos Slim",
    phone: "8155555555",
    email: "caminoreal@cliente.mx",
    address: "Av. Diego Rivera 2492, San Pedro",
    locations: [{ id: "l3", name: "Recepción Principal", address: "Av. Diego Rivera 2492, San Pedro" }],
    frequentMaterials: ["Vidrio", "PET", "Cartón"],
    status: "ACTIVO",
    totalCollectedKg: 3200,
  }
];

export const seedDrivers: Driver[] = [
  { id: "d1", name: "Miguel Hernández", phone: "8111111111", email: "miguel@seralsa.mx", employeeNumber: "OP-001", vehicleId: "v1", status: "EN_RUTA", rating: 4.8 },
  { id: "d2", name: "José Luis Ramírez", phone: "8122222222", email: "jose.ramirez@seralsa.mx", employeeNumber: "OP-002", vehicleId: "v2", status: "DISPONIBLE", rating: 4.5 },
  { id: "d3", name: "Ricardo Flores", phone: "8133333333", email: "ricardo@seralsa.mx", employeeNumber: "OP-003", vehicleId: "v3", status: "NO_DISPONIBLE", rating: 4.9 },
];

export const seedVehicles: Vehicle[] = [
  { id: "v1", plates: "CTR-112-C", model: "Camión 5 ton", capacity: "5000kg" },
  { id: "v2", plates: "NTE-445-A", model: "Camión 3.5 ton", capacity: "3500kg" },
  { id: "v3", plates: "SUR-334-D", model: "Camioneta 1.5 ton", capacity: "1500kg" },
];

const today = new Date().toISOString().split('T')[0];

export const seedOrders: Order[] = [
  {
    id: "o1",
    folio: "ORD-2026-001",
    clientId: "c1",
    locationId: "l1",
    scheduledDate: today,
    scheduledTime: "08:00",
    serviceType: "Recolección Programada",
    expectedMaterials: ["Chatarra", "Cartón"],
    status: "COMPLETADA",
    priority: "ALTA",
    driverId: "d1",
    vehicleId: "v1",
    startedAt: `${today}T08:05:00Z`,
    arrivedAt: `${today}T08:45:00Z`,
    arrivalLat: 25.6866,
    arrivalLng: -100.3161,
    evidenceBeforeUrl: "https://picsum.photos/seed/scrap1/400/300",
    evidenceAfterUrl: "https://picsum.photos/seed/scrap2/400/300",
    collectedMaterials: [
      { material: "Chatarra", weightKg: 1200 },
      { material: "Cartón", weightKg: 350 }
    ],
    operatorObservations: "Todo en orden, material listo en andén.",
    operatorSignatureUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    clientSignatureUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    completedAt: `${today}T09:30:00Z`
  },
  {
    id: "o2",
    folio: "ORD-2026-002",
    clientId: "c2",
    locationId: "l2",
    scheduledDate: today,
    scheduledTime: "11:00",
    serviceType: "Recolección Programada",
    expectedMaterials: ["Cartón", "Plástico"],
    status: "EN_RUTA",
    priority: "MEDIA",
    driverId: "d1",
    vehicleId: "v1",
    startedAt: `${today}T10:45:00Z`,
    collectedMaterials: []
  },
  {
    id: "o3",
    folio: "ORD-2026-003",
    clientId: "c3",
    locationId: "l3",
    scheduledDate: today,
    scheduledTime: "14:00",
    serviceType: "Recolección Especial",
    expectedMaterials: ["Vidrio"],
    status: "ASIGNADA",
    priority: "ALTA",
    driverId: "d2",
    vehicleId: "v2",
    collectedMaterials: []
  },
  {
    id: "o4",
    folio: "ORD-2026-004",
    clientId: "c1",
    locationId: "l1",
    scheduledDate: today,
    scheduledTime: "16:00",
    serviceType: "Recolección Programada",
    expectedMaterials: ["Tarimas"],
    status: "PENDIENTE",
    priority: "BAJA",
    collectedMaterials: []
  }
];

export const seedRoutes: Route[] = [
  {
    id: "r1",
    name: "Ruta Norte - Industrial",
    date: today,
    driverId: "d1",
    vehicleId: "v1",
    status: "ACTIVA",
    orderIds: ["o1", "o2"],
    estimatedDistanceKm: 45
  }
];

export const seedRequests: CustomerRequest[] = [
  {
    id: "req1",
    clientId: "c1",
    locationId: "l1",
    requestedDate: "2026-04-10",
    estimatedMaterials: ["Chatarra"],
    status: "PENDIENTE",
    createdAt: `${today}T07:00:00Z`
  }
];

export const MATERIALS_LIST = [
  "Cartón", "Plástico", "PET", "Chatarra", "Tarimas", "Papel", "Vidrio", "Electrónicos", "Mixto", "Otro"
];
