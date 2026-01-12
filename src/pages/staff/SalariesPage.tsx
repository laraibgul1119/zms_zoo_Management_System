import React, { useState } from 'react';
import { Navbar } from '../../components/ui/Navbar';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { mockEmployees } from '../../utils/mockData';
import { Employee } from '../../types';
import { DollarSign } from 'lucide-react';
export function SalariesPage() {
  const [employees] = useState<Employee[]>(mockEmployees);
  return <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />
      <main className="max-w-[1920px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase mb-2">
            Payroll Management
          </h1>
          <p className="text-gray-600 font-bold">
            Review and update employee compensation
          </p>
        </div>

        <Card>
          <Table data={employees} keyField="id" columns={[{
          header: 'Employee',
          accessor: 'name'
        }, {
          header: 'Role',
          accessor: 'role'
        }, {
          header: 'Annual Salary',
          accessor: e => `$${e.salary.toLocaleString()}`
        }, {
          header: 'Monthly Gross',
          accessor: e => `$${Math.round(e.salary / 12).toLocaleString()}`
        }, {
          header: 'Status',
          accessor: 'status'
        }]} actions={() => <button className="p-2 border-2 border-black hover:bg-gray-100">
                <DollarSign className="w-4 h-4" />
              </button>} />
        </Card>
      </main>
    </div>;
}