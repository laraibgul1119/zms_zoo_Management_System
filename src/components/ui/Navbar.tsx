import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, LayoutDashboard, PawPrint, Users, Stethoscope, Syringe, Package, Calendar, Ticket, UserCheck, DollarSign } from 'lucide-react';
export function Navbar() {
  const {
    logout,
    user
  } = useAuth();
  const location = useLocation();
  const navItems = [{
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    path: '/animals',
    label: 'Animals',
    icon: PawPrint
  }, {
    path: '/cages',
    label: 'Cages',
    icon: Package
  }, {
    path: '/employees',
    label: 'Staff',
    icon: Users
  }, {
    path: '/doctors',
    label: 'Doctors',
    icon: Stethoscope
  }, {
    path: '/medical-checks',
    label: 'Med Checks',
    icon: Stethoscope
  }, {
    path: '/vaccinations',
    label: 'Vaccines',
    icon: Syringe
  }, {
    path: '/inventory',
    label: 'Inventory',
    icon: Package
  }, {
    path: '/ticket-sales',
    label: 'Sales',
    icon: DollarSign
  }, {
    path: '/event-management',
    label: 'Events',
    icon: Calendar
  }, {
    path: '/visitors',
    label: 'Visitors',
    icon: UserCheck
  }];
  return <nav className="bg-white border-b-4 border-black sticky top-0 z-40">
    <div className="max-w-[1920px] mx-auto px-4">
      <div className="flex justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase hidden md:block">
            Zootopia Staff
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold hidden md:block">
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Scrollable horizontal nav */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path} className={`
                    flex items-center gap-2 px-4 py-2 font-bold border-2 border-black transition-all whitespace-nowrap
                    ${isActive ? 'bg-[#2563EB] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'}
                  `}>
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>;
          })}
        </div>
      </div>
    </div>
  </nav>;
}