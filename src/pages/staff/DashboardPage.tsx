import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/ui/Navbar';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { api } from '../../utils/api';
import { Animal, Event } from '../../types';
import { PawPrint, Users, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({ animals: 0, employees: 0, cages: 0, revenue: 0 });
  const [sickAnimals, setSickAnimals] = React.useState<Animal[]>([]);
  const [upcomingEventsCount, setUpcomingEventsCount] = React.useState(0);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, animalsData, eventsData] = await Promise.all([
          api.getDashboardStats(),
          api.getAnimals(),
          api.getEvents()
        ]);
        setStats(statsData);
        setSickAnimals(animalsData.filter((a: Animal) => a.healthStatus !== 'Healthy'));

        // Filter upcoming events (events with startTime in the future)
        const now = new Date();
        const upcoming = eventsData.filter((event: Event) => {
          const eventStart = new Date(event.startTime);
          return eventStart > now;
        });
        setUpcomingEventsCount(upcoming.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  const totalAnimals = stats.animals;
  const totalEmployees = stats.employees;
  const totalRevenue = stats.revenue;
  return <div className="min-h-screen bg-[#F3F4F6]">
    <Navbar />

    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 font-bold">
          Welcome back to the command center
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Animals" value={totalAnimals} icon={PawPrint} color="#2563EB" trend="+2 this month" />
        <StatCard label="Active Staff" value={totalEmployees} icon={Users} color="#10B981" />
        <StatCard label="Upcoming Events" value={upcomingEventsCount} icon={Calendar} color="#FBBF24" />
        <StatCard label="Revenue (Today)" value={`$${totalRevenue}`} icon={DollarSign} color="#F97316" trend="+12% vs yesterday" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Alerts */}
        <Card title="Health Alerts" className="h-full">
          {sickAnimals.length > 0 ? <div className="space-y-4">
            {sickAnimals.map(animal => <div key={animal.id} className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 border-l-4 border-l-red-500">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-black text-lg">
                    {animal.name} ({animal.species})
                  </div>
                  <div className="text-sm font-bold text-red-600">
                    {animal.healthStatus}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/staff/medical-checks?animalId=${animal.id}`)}
                className="text-sm font-bold underline hover:text-red-600"
              >
                View Details
              </button>
            </div>)}
          </div> : <div className="text-center py-8 text-gray-500 font-bold">
            No health alerts. All animals are healthy!
          </div>}
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" className="h-full">
          <div className="text-center py-8 text-gray-500 font-bold">
            Real-time ticket sales tracking enabled.
          </div>
        </Card>
      </div>
    </main>
  </div>;
}