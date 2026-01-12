import React, { useState } from 'react';
import { Navbar } from '../../components/ui/Navbar';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { mockVisitors } from '../../utils/mockData';
import { Visitor } from '../../types';
import { Mail, Phone } from 'lucide-react';
export function VisitorsPage() {
  const [visitors] = useState<Visitor[]>(mockVisitors);
  return <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />
      <main className="max-w-[1920px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase mb-2">
            Visitor Database
          </h1>
          <p className="text-gray-600 font-bold">
            Registered users and contact information
          </p>
        </div>

        <Card>
          <Table data={visitors} keyField="id" columns={[{
          header: 'Name',
          accessor: 'name'
        }, {
          header: 'Contact Info',
          accessor: v => <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" /> {v.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {v.phone}
                    </div>
                  </div>
        }, {
          header: 'Registration Date',
          accessor: 'registrationDate'
        }]} />
        </Card>
      </main>
    </div>;
}