
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Tenant } from '../types';

const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.586l-4.293-4.293a1 1 0 011.414-1.414L10 10.172l2.879-2.879a1 1 0 111.414 1.414L11.414 12.586A1.99 1.99 0 0110 13a1.99 1.99 0 01-1.414-.414zM4 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 10a1 1 0 100 2h8a1 1 0 100-2H5z" /></svg>;

const Payments: React.FC = () => {
  const { payments, properties, tenants } = useAppContext();
  const [selectedTenantId, setSelectedTenantId] = useState('all');

  const getPropertyAddress = (propertyId: string) => properties.find(p => p.id === propertyId)?.address || 'N/A';
  const getTenant = (tenantId: string): Tenant | undefined => tenants.find(t => t.id === tenantId);

  const filteredPayments = payments.filter(p => 
      selectedTenantId === 'all' || p.tenant_id === selectedTenantId
  );

  const escapeCSV = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;

  const exportToCSV = () => {
    const headers = "Date,Tenant Name,Tenant Email,Tenant Phone,Property,Amount (₹)";
    
    const rows = filteredPayments.map(p => {
        const tenant = getTenant(p.tenant_id);
        const rowData = [
            p.date,
            tenant?.name || 'N/A',
            tenant?.email || 'N/A',
            tenant?.phone || 'N/A',
            getPropertyAddress(p.property_id),
            p.amount
        ].map(escapeCSV);
        return rowData.join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    const selectedTenant = getTenant(selectedTenantId);
    const fileName = selectedTenantId === 'all' 
        ? 'rent_payments_all.csv' 
        : `rent_payments_${selectedTenant?.name.replace(/ /g, '_') || 'tenant'}.csv`;

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
            <div className="flex items-center gap-4">
                <select 
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="all">All Tenants</option>
                    {tenants.map(tenant => (
                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                </select>
                <button 
                    onClick={exportToCSV}
                    disabled={filteredPayments.length === 0}
                    className="flex items-center justify-center bg-secondary text-white px-4 py-2 rounded-md hover:bg-green-600 shadow transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap">
                    <ExportIcon />
                    Export to CSV
                </button>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 font-semibold text-sm text-gray-600">Date</th>
                        <th className="p-4 font-semibold text-sm text-gray-600">Tenant</th>
                        <th className="p-4 font-semibold text-sm text-gray-600">Property</th>
                        <th className="p-4 font-semibold text-sm text-gray-600">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredPayments.length > 0 ? (
                        filteredPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{p.date}</td>
                                <td className="p-4 text-sm text-gray-800 font-medium whitespace-nowrap">{getTenant(p.tenant_id)?.name || 'N/A'}</td>
                                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{getPropertyAddress(p.property_id)}</td>
                                <td className="p-4 text-sm text-gray-800 font-medium whitespace-nowrap">₹{p.amount.toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center p-8 text-gray-500">
                                No payment records found for the selected tenant.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Payments;