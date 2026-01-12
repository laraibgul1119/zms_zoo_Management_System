import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { TicketPurchasePage } from './pages/public/TicketPurchasePage';
import { EventsPage } from './pages/public/EventsPage';
import { LoginPage } from './pages/staff/LoginPage';
import { DashboardPage } from './pages/staff/DashboardPage';
import { AnimalsPage } from './pages/staff/AnimalsPage';
import { CagesPage } from './pages/staff/CagesPage';
import { DoctorsPage } from './pages/staff/DoctorsPage';
import { MedicalChecksPage } from './pages/staff/MedicalChecksPage';
import { VaccinationsPage } from './pages/staff/VaccinationsPage';
import { EmployeesPage } from './pages/staff/EmployeesPage';
import { SalariesPage } from './pages/staff/SalariesPage';
import { InventoryPage } from './pages/staff/InventoryPage';
import { TicketSalesPage } from './pages/staff/TicketSalesPage';
import { EventManagementPage } from './pages/staff/EventManagementPage';
import { VisitorsPage } from './pages/staff/VisitorsPage';
export function App() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tickets" element={<TicketPurchasePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Staff Routes */}
          <Route path="/dashboard" element={<ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>} />
          <Route path="/animals" element={<ProtectedRoute>
                <AnimalsPage />
              </ProtectedRoute>} />
          <Route path="/cages" element={<ProtectedRoute>
                <CagesPage />
              </ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute>
                <DoctorsPage />
              </ProtectedRoute>} />
          <Route path="/medical-checks" element={<ProtectedRoute>
                <MedicalChecksPage />
              </ProtectedRoute>} />
          <Route path="/vaccinations" element={<ProtectedRoute>
                <VaccinationsPage />
              </ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>} />
          <Route path="/salaries" element={<ProtectedRoute>
                <SalariesPage />
              </ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>} />
          <Route path="/ticket-sales" element={<ProtectedRoute>
                <TicketSalesPage />
              </ProtectedRoute>} />
          <Route path="/event-management" element={<ProtectedRoute>
                <EventManagementPage />
              </ProtectedRoute>} />
          <Route path="/visitors" element={<ProtectedRoute>
                <VisitorsPage />
              </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>;
}