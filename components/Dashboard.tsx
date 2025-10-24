
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PaymentStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition-transform transform hover:scale-105">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

const PropertyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const OccupiedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a3.001 3.001 0 01-3.712 0M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const RentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01v.01M12 18v-1m0-1v-.01m0-2.01v-.01M12 20v-1m0 0v-1m0 0v-1m0 0V4m0 16v-1" /></svg>;
const OverdueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


const Dashboard: React.FC = () => {
  const { properties, payments, getPaymentStatusForTenant } = useAppContext();
  
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRentCollected = payments
    .filter(p => new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
    .reduce((sum, p) => sum + p.amount, 0);

  const overduePayments = properties
    .filter(p => p.status === 'occupied' && p.tenant_id)
    .map(p => getPaymentStatusForTenant(p.tenant_id!, p.rent))
    .filter(status => status.status === PaymentStatus.Overdue)
    .reduce((sum, s) => sum + s.amountDue, 0);

  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={totalProperties} icon={<PropertyIcon />} color="bg-blue-500" />
        <StatCard title="Occupied Units" value={`${occupiedProperties} / ${totalProperties}`} icon={<OccupiedIcon />} color="bg-green-500" />
        <StatCard title="Rent Collected (This Month)" value={`₹${monthlyRentCollected.toLocaleString()}`} icon={<RentIcon />} color="bg-indigo-500" />
        <StatCard title="Overdue Rent" value={`₹${overduePayments.toLocaleString()}`} icon={<OverdueIcon />} color="bg-red-500" />
      </div>
    </div>
  );
};

export default Dashboard;