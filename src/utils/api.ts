import { mockApi } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Use mock API if VITE_USE_MOCK_API is set to 'true'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

if (USE_MOCK) {
    console.log('🎭 Using Mock API (no backend required)');
} else {
    console.log('🌐 Using Real API:', API_BASE_URL);
    if (API_BASE_URL.includes('localhost') && window.location.hostname !== 'localhost') {
        console.warn('⚠️ WARNING: You are on a production site but the API is pointing to localhost. Did you forget to set VITE_API_URL in your deployment settings?');
    }
}

// Real API implementation
const realApi = {
    // Auth
    login: (credentials: any) => fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
    }),
    register: (userData: any) => fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(res => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
    }),

    // Animals
    getAnimals: () => fetch(`${API_BASE_URL}/animals`).then(res => res.json()),
    createAnimal: (data: any) => fetch(`${API_BASE_URL}/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateAnimal: (id: string, data: any) => fetch(`${API_BASE_URL}/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteAnimal: (id: string) => fetch(`${API_BASE_URL}/animals/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Cages
    getCages: () => fetch(`${API_BASE_URL}/cages`).then(res => res.json()),
    createCage: (data: any) => fetch(`${API_BASE_URL}/cages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateCage: (id: string, data: any) => fetch(`${API_BASE_URL}/cages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteCage: (id: string) => fetch(`${API_BASE_URL}/cages/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Employees
    getEmployees: () => fetch(`${API_BASE_URL}/employees`).then(res => res.json()),
    createEmployee: (data: any) => fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateEmployee: (id: string, data: any) => fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteEmployee: (id: string) => fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Doctors
    getDoctors: () => fetch(`${API_BASE_URL}/doctors`).then(res => res.json()),
    createDoctor: (data: any) => fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateDoctor: (id: string, data: any) => fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteDoctor: (id: string) => fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Events
    getEvents: () => fetch(`${API_BASE_URL}/events`).then(res => res.json()),
    createEvent: (data: any) => fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateEvent: (id: string, data: any) => fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteEvent: (id: string) => fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Tickets
    getTickets: () => fetch(`${API_BASE_URL}/tickets`).then(res => res.json()),
    createTicket: (data: any) => fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateTicket: (id: string, data: any) => fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteTicket: (id: string) => fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Ticket Sales
    getTicketSales: () => fetch(`${API_BASE_URL}/ticket-sales`).then(res => res.json()),
    createTicketSale: (data: any) => fetch(`${API_BASE_URL}/ticket-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Visitors
    getVisitors: () => fetch(`${API_BASE_URL}/visitors`).then(res => res.json()),
    createVisitor: (data: any) => fetch(`${API_BASE_URL}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Inventory
    getInventory: () => fetch(`${API_BASE_URL}/inventory`).then(res => res.json()),
    createInventoryItem: (data: any) => fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateInventoryItem: (id: string, data: any) => fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteInventoryItem: (id: string) => fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Medical Checks
    getMedicalChecks: () => fetch(`${API_BASE_URL}/medical-checks`).then(res => res.json()),
    createMedicalCheck: (data: any) => fetch(`${API_BASE_URL}/medical-checks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateMedicalCheck: (id: string, data: any) => fetch(`${API_BASE_URL}/medical-checks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteMedicalCheck: (id: string) => fetch(`${API_BASE_URL}/medical-checks/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Vaccinations
    getVaccinations: () => fetch(`${API_BASE_URL}/vaccinations`).then(res => res.json()),
    createVaccination: (data: any) => fetch(`${API_BASE_URL}/vaccinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateVaccination: (id: string, data: any) => fetch(`${API_BASE_URL}/vaccinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteVaccination: (id: string) => fetch(`${API_BASE_URL}/vaccinations/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Zoo Info
    getZooInfo: () => fetch(`${API_BASE_URL}/zoo-info`).then(res => res.json()),

    // Dashboard Stats
    getDashboardStats: () => fetch(`${API_BASE_URL}/dashboard/stats`).then(res => res.json()),
};

// Export the appropriate API based on USE_MOCK flag
export const api = USE_MOCK ? mockApi : realApi;
