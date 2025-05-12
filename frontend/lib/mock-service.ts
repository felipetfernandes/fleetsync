import {
    getDashboardData,
    getFleetData,
    getVehicleData,
    getVehicleOrders,
    getWorkshopsData,
    getOrdersData,
    getOrderData,
    getFormSelectData,
    getOrdersByVehiclePlate,
    getCurrentUser,
  } from "@/lib/mock-data"
  
  // Serviço para o Dashboard
  export const DashboardService = {
    getStats: () => {
      return getDashboardData()
    },
  }
  
  // Serviço para Veículos
  export const VehicleService = {
    getAllVehicles: () => {
      return getFleetData()
    },
  
    getVehicleByPlate: (plate: string) => {
      return getVehicleData(plate)
    },
  
    getVehicleOrders: (vehicleId: string) => {
      return getVehicleOrders(vehicleId)
    },
  
    getOrdersByVehiclePlate: (plate: string) => {
      return getOrdersByVehiclePlate(plate)
    },
  
    addVehicle: (vehicle: Partial<Vehicle>) => {
      console.log("Adicionando veículo:", vehicle)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true, id: "new-vehicle-id" }
    },
  
    updateVehicle: (id: string, vehicle: Partial<Vehicle>) => {
      console.log("Atualizando veículo:", id, vehicle)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  
    deleteVehicle: (id: string) => {
      console.log("Excluindo veículo:", id)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  }
  
  // Serviço para Oficinas
  export const WorkshopService = {
    getAllWorkshops: () => {
      return getWorkshopsData()
    },
  
    getWorkshopById: (id: string) => {
      const workshops = getWorkshopsData()
      return workshops.find((w) => w.id === id)
    },
  
    addWorkshop: (workshop: Partial<Workshop>) => {
      console.log("Adicionando oficina:", workshop)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true, id: "new-workshop-id" }
    },
  
    updateWorkshop: (id: string, workshop: Partial<Workshop>) => {
      console.log("Atualizando oficina:", id, workshop)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  
    deleteWorkshop: (id: string) => {
      console.log("Excluindo oficina:", id)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  }
  
  // Serviço para Ordens de Serviço
  export const OrderService = {
    getAllOrders: () => {
      return getOrdersData()
    },
  
    getOrderById: (id: string) => {
      return getOrderData(id)
    },
  
    addOrder: (order: Partial<ServiceOrder>) => {
      console.log("Adicionando ordem:", order)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true, id: "new-order-id" }
    },
  
    updateOrder: (id: string, order: Partial<ServiceOrder>) => {
      console.log("Atualizando ordem:", id, order)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  
    deleteOrder: (id: string) => {
      console.log("Excluindo ordem:", id)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  
    updateOrderStatus: (id: string, status: string, description: string) => {
      console.log("Atualizando status da ordem:", id, status, description)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  }
  
  // Serviço para Formulários
  export const FormService = {
    getSelectOptions: () => {
      return getFormSelectData()
    },
  }
  
  // Serviço para Usuários
  export const UserService = {
    getCurrentUser: () => {
      return getCurrentUser()
    },
  
    getAllDrivers: () => {
      const users = getCurrentUser()
      return users
    },
  
    getUserById: (id: string) => {
      const users = getCurrentUser()
      return users
    },
  
    login: (email: string, password: string) => {
      console.log("Login:", email, password)
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true, user: getCurrentUser() }
    },
  
    logout: () => {
      console.log("Logout")
      // Em uma aplicação real, isso enviaria os dados para a API
      return { success: true }
    },
  }
  