// Mock API for demo/portfolio deployment (no backend needed)

// Mock data
const mockAnimals = [
  { id: 'animal-1', name: 'Leo', species: 'Lion', age: 5, gender: 'Male', healthStatus: 'Healthy', cageId: 'cage-1', notes: 'King of the jungle' },
  { id: 'animal-2', name: 'Ella', species: 'Elephant', age: 12, gender: 'Female', healthStatus: 'Healthy', cageId: 'cage-2', notes: 'Very friendly' },
  { id: 'animal-3', name: 'Zara', species: 'Zebra', age: 3, gender: 'Female', healthStatus: 'Healthy', cageId: 'cage-3', notes: 'Loves to run' }
];

const mockCages = [
  { id: 'cage-1', name: 'Lion Den', type: 'Carnivore', capacity: 4, occupancy: 1, location: 'North Wing', status: 'Active' },
  { id: 'cage-2', name: 'Elephant Habitat', type: 'Herbivore', capacity: 6, occupancy: 1, location: 'East Wing', status: 'Active' },
  { id: 'cage-3', name: 'Zebra Plains', type: 'Herbivore', capacity: 10, occupancy: 1, location: 'South Wing', status: 'Active' }
];

const mockEmployees = [
  { id: 'emp-1', name: 'John Doe', email: 'john@zoo.com', role: 'Zookeeper', phone: '555-0101', salary: 45000, joinDate: '2023-01-15', status: 'Active' },
  { id: 'emp-2', name: 'Jane Smith', email: 'jane@zoo.com', role: 'Veterinarian', phone: '555-0102', salary: 65000, joinDate: '2023-03-20', status: 'Active' }
];

const mockDoctors = [
  { id: 'doc-1', name: 'Dr. Sarah Johnson', specialization: 'Large Animals', email: 'sarah@zoo.com', phone: '555-0201', availability: 'Available', experience: '10 years' },
  { id: 'doc-2', name: 'Dr. Mike Chen', specialization: 'Exotic Birds', email: 'mike@zoo.com', phone: '555-0202', availability: 'Available', experience: '8 years' }
];

const mockEvents = [
  { id: 'event-1', title: 'Feeding Time', description: 'Watch the lions being fed', date: '2026-01-20', time: '14:00', location: 'Lion Den', capacity: 50, registeredCount: 25, status: 'Upcoming' },
  { id: 'event-2', title: 'Zoo Tour', description: 'Guided tour of the entire zoo', date: '2026-01-22', time: '10:00', location: 'Main Entrance', capacity: 30, registeredCount: 15, status: 'Upcoming' }
];

const mockTickets = [
  { id: 'ticket-1', type: 'Adult', price: 25, description: 'Adult admission', startDate: '2026-01-01', discountPercentage: 0 },
  { id: 'ticket-2', type: 'Child', price: 15, description: 'Child admission (under 12)', startDate: '2026-01-01', discountPercentage: 0 },
  { id: 'ticket-3', type: 'Senior', price: 20, description: 'Senior admission (65+)', startDate: '2026-01-01', discountPercentage: 20 }
];

const mockUsers = [
  { id: 'user-1', name: 'Admin User', email: 'admin@zoo.com', password: 'admin123', role: 'admin' },
  { id: 'user-2', name: 'Staff User', email: 'staff@zoo.com', password: 'staff123', role: 'staff' },
  { id: 'user-3', name: 'Visitor User', email: 'visitor@zoo.com', password: 'visitor123', role: 'visitor' }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth
  login: async (credentials: any) => {
    await delay(500);
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (userData: any) => {
    await delay(500);
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: userData.role || 'visitor'
    };
    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Animals
  getAnimals: async () => { await delay(300); return mockAnimals; },
  createAnimal: async (data: any) => { await delay(300); mockAnimals.push(data); return data; },
  updateAnimal: async (id: string, data: any) => { await delay(300); return data; },
  deleteAnimal: async (id: string) => { await delay(300); return { success: true }; },

  // Cages
  getCages: async () => { await delay(300); return mockCages; },
  createCage: async (data: any) => { await delay(300); mockCages.push(data); return data; },
  updateCage: async (id: string, data: any) => { await delay(300); return data; },
  deleteCage: async (id: string) => { await delay(300); return { success: true }; },

  // Employees
  getEmployees: async () => { await delay(300); return mockEmployees; },
  createEmployee: async (data: any) => { await delay(300); mockEmployees.push(data); return data; },
  updateEmployee: async (id: string, data: any) => { await delay(300); return data; },
  deleteEmployee: async (id: string) => { await delay(300); return { success: true }; },

  // Doctors
  getDoctors: async () => { await delay(300); return mockDoctors; },
  createDoctor: async (data: any) => { await delay(300); mockDoctors.push(data); return data; },
  updateDoctor: async (id: string, data: any) => { await delay(300); return data; },
  deleteDoctor: async (id: string) => { await delay(300); return { success: true }; },

  // Events
  getEvents: async () => { await delay(300); return mockEvents; },
  createEvent: async (data: any) => { await delay(300); mockEvents.push(data); return data; },
  updateEvent: async (id: string, data: any) => { await delay(300); return data; },
  deleteEvent: async (id: string) => { await delay(300); return { success: true }; },

  // Tickets
  getTickets: async () => { await delay(300); return mockTickets; },
  createTicket: async (data: any) => { await delay(300); mockTickets.push(data); return data; },
  updateTicket: async (id: string, data: any) => { await delay(300); return data; },
  deleteTicket: async (id: string) => { await delay(300); return { success: true }; },

  // Other endpoints
  getTicketSales: async () => { await delay(300); return []; },
  createTicketSale: async (data: any) => { await delay(300); return data; },
  getVisitors: async () => { await delay(300); return []; },
  createVisitor: async (data: any) => { await delay(300); return data; },
  getInventory: async () => { await delay(300); return []; },
  createInventoryItem: async (data: any) => { await delay(300); return data; },
  updateInventoryItem: async (id: string, data: any) => { await delay(300); return data; },
  deleteInventoryItem: async (id: string) => { await delay(300); return { success: true }; },
  getMedicalChecks: async () => { await delay(300); return []; },
  createMedicalCheck: async (data: any) => { await delay(300); return data; },
  updateMedicalCheck: async (id: string, data: any) => { await delay(300); return data; },
  deleteMedicalCheck: async (id: string) => { await delay(300); return { success: true }; },
  getVaccinations: async () => { await delay(300); return []; },
  createVaccination: async (data: any) => { await delay(300); return data; },
  updateVaccination: async (id: string, data: any) => { await delay(300); return data; },
  deleteVaccination: async (id: string) => { await delay(300); return { success: true }; },
  getZooInfo: async () => { 
    await delay(300); 
    return { 
      id: 1, 
      name: 'Zootopia Wildlife Park', 
      location: 'Downtown', 
      description: 'A wonderful zoo', 
      capacity: '5000', 
      startTime: '09:00', 
      endTime: '18:00' 
    }; 
  },
  getDashboardStats: async () => { 
    await delay(300); 
    return { 
      animals: mockAnimals.length, 
      employees: mockEmployees.length, 
      cages: mockCages.length, 
      revenue: 15000 
    }; 
  },
};
