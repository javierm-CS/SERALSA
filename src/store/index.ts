import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Client, Driver, Vehicle, Order, Route, CustomerRequest } from '../types';
import { seedUsers, seedClients, seedDrivers, seedVehicles, seedOrders, seedRoutes, seedRequests } from '../lib/seed';

interface AppState {
  currentUser: User | null;
  users: User[];
  clients: Client[];
  drivers: Driver[];
  vehicles: Vehicle[];
  orders: Order[];
  routes: Route[];
  requests: CustomerRequest[];
  
  login: (email: string) => void;
  logout: () => void;
  
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  
  addRoute: (route: Route) => void;
  updateRoute: (id: string, data: Partial<Route>) => void;
  
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  
  addRequest: (request: CustomerRequest) => void;
  
  resetStore: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: seedUsers,
      clients: seedClients,
      drivers: seedDrivers,
      vehicles: seedVehicles,
      orders: seedOrders,
      routes: seedRoutes,
      requests: seedRequests,

      login: (email) => set((state) => {
        const user = state.users.find(u => u.email === email);
        return { currentUser: user || null };
      }),
      logout: () => set({ currentUser: null }),

      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrder: (id, data) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, ...data } : o)
      })),

      addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
      updateRoute: (id, data) => set((state) => ({
        routes: state.routes.map(r => r.id === id ? { ...r, ...data } : r)
      })),

      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, data) => set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
      })),

      addDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),
      updateDriver: (id, data) => set((state) => ({
        drivers: state.drivers.map(d => d.id === id ? { ...d, ...data } : d)
      })),

      addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),

      resetStore: () => set({
        currentUser: null,
        users: seedUsers,
        clients: seedClients,
        drivers: seedDrivers,
        vehicles: seedVehicles,
        orders: seedOrders,
        routes: seedRoutes,
        requests: seedRequests,
      })
    }),
    {
      name: 'seralsa-storage',
      version: 1, // Bump version to clear old state
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            currentUser: null,
            users: seedUsers,
            clients: seedClients,
            drivers: seedDrivers,
            vehicles: seedVehicles,
            orders: seedOrders,
            routes: seedRoutes,
            requests: seedRequests,
          };
        }
        return persistedState;
      }
    }
  )
);
