

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Tenant, Property, PaymentStatus, Payment } from '../types';
import { Modal, ConfirmationModal } from './ui/Modal';

const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const PropertyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.333a2 2 0 002 2V5a2 2 0 012 2v2a2 2 0 01-2 2h-1v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2H6a2 2 0 01-2-2V7a2 2 0 012-2v-.667a2 2 0 002-2V3a1 1 0 011-1zm3 8H7v2h6v-2z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;


const TenantForm: React.FC<{ tenant?: Tenant, onSave: (tenant: Omit<Tenant, 'id' | 'user_id'> | Tenant) => void, onClose: () => void }> = ({ tenant, onSave, onClose }) => {
    const { properties } = useAppContext();
    const [name, setName] = useState(tenant?.name || '');
    const [email, setEmail] = useState(tenant?.email || '');
    const [phone, setPhone] = useState(tenant?.phone || '');
    const [moveInDate, setMoveInDate] = useState(tenant?.move_in_date || '');
    const [propertyId, setPropertyId] = useState(tenant?.property_id || '');

    const vacantProperties = properties.filter(p => p.status === 'vacant' || p.id === tenant?.property_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tenantData = { name, email, phone, move_in_date: moveInDate, property_id: propertyId || undefined };
        
        if (tenant) {
            onSave({ ...tenant, ...tenantData });
        } else {
            onSave(tenantData as Omit<Tenant, 'id' | 'user_id'>);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Assign to Property</label>
                    <select value={propertyId} onChange={e => setPropertyId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="">Unassigned</option>
                        {vacantProperties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Move-in Date</label>
                    <input type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Save Tenant</button>
            </div>
        </form>
    );
};

const LogPaymentForm: React.FC<{
  tenant: Tenant;
  property: Property;
  onSave: (payment: Omit<Payment, 'id' | 'user_id'>) => void;
  onClose: () => void;
}> = ({ tenant, property, onSave, onClose }) => {
    const today = new Date();
    
    const [amount, setAmount] = useState(property.rent);
    const [date, setDate] = useState(today.toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            tenant_id: tenant.id,
            property_id: property.id,
            amount,
            date,
            month: new Date(date).getMonth(),
            year: new Date(date).getFullYear()
        });
    }

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p><strong>Tenant:</strong> {tenant.name}</p>
                <p><strong>Property:</strong> {property.address}</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
            </div>
             <p className="text-sm text-gray-500">This will log a payment for {new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Log Payment</button>
            </div>
        </form>
    )
}

const TenantCard: React.FC<{
    tenant: Tenant;
    onEdit: (tenant: Tenant) => void;
    onDelete: (id: string) => void;
    onLogPayment: (tenant: Tenant) => void;
}> = ({ tenant, onEdit, onDelete, onLogPayment }) => {
    const { properties, getPaymentStatusForTenant } = useAppContext();
    const property = properties.find(p => p.id === tenant.property_id);
    const paymentInfo = property ? getPaymentStatusForTenant(tenant.id, property.rent) : null;

    const statusInfo = {
        [PaymentStatus.Paid]: { text: 'Paid', color: 'bg-green-100 text-green-800' },
        [PaymentStatus.Overdue]: { text: 'Overdue', color: 'bg-red-100 text-red-800' },
        [PaymentStatus.Due]: { text: 'Due', color: 'bg-yellow-100 text-yellow-800' },
    };

    const currentStatus = paymentInfo ? statusInfo[paymentInfo.status] : null;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{tenant.name}</h3>
                    {currentStatus && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${currentStatus.color}`}>
                            {currentStatus.text}
                        </span>
                    )}
                </div>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                        <EmailIcon />
                        <span className="ml-3">{tenant.email}</span>
                    </div>
                    <div className="flex items-center">
                        <PhoneIcon />
                        <span className="ml-3">{tenant.phone}</span>
                    </div>
                     <div className="flex items-center">
                        <PropertyIcon />
                        <span className="ml-3">{property?.address || <span className="italic text-gray-500">Unassigned</span>}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon />
                        <span className="ml-3">Moved in: {tenant.move_in_date}</span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center space-x-2">
                 {property && paymentInfo?.status !== PaymentStatus.Paid ? (
                    <button onClick={() => onLogPayment(tenant)} className="w-full text-sm bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold">
                        Log Payment
                    </button>
                ) : <div className="w-full"></div>}
                <div className="flex items-center">
                     <button onClick={() => onEdit(tenant)} className="text-gray-400 hover:text-blue-500 p-2 rounded-full transition-colors"><EditIcon /></button>
                     <button onClick={() => onDelete(tenant.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"><DeleteIcon /></button>
                </div>
            </div>
        </div>
    );
};


const Tenants: React.FC = () => {
  const { tenants, addTenant, updateTenant, deleteTenant, logPayment } = useAppContext();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | undefined>(undefined);
  const [payingTenant, setPayingTenant] = useState<Tenant | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null);
  const { properties } = useAppContext();


  const handleAddClick = () => {
    setEditingTenant(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsFormModalOpen(true);
  };
  
  const handleLogPaymentClick = (tenant: Tenant) => {
    setPayingTenant(tenant);
    setIsPaymentModalOpen(true);
  }

  const handleDeleteClick = (id: string) => {
      setDeletingTenantId(id);
      setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
      if (deletingTenantId) {
          deleteTenant(deletingTenantId);
      }
  };

  const handleSaveTenant = (tenantData: Omit<Tenant, 'id' | 'user_id'> | Tenant) => {
      if ('id' in tenantData) {
          updateTenant(tenantData as Tenant);
      } else {
          addTenant(tenantData as Omit<Tenant, 'id' | 'user_id'>);
      }
      setIsFormModalOpen(false);
  };
  
  const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'user_id'>) => {
    logPayment(paymentData);
    setIsPaymentModalOpen(false);
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Tenants</h1>
            <button onClick={handleAddClick} className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark shadow transition-colors">
                <AddIcon />
                Add Tenant
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tenants.map(tenant => (
                <TenantCard
                    key={tenant.id}
                    tenant={tenant}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onLogPayment={handleLogPaymentClick}
                />
            ))}
        </div>
        
        {isFormModalOpen && (
            <Modal onClose={() => setIsFormModalOpen(false)}>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
                <TenantForm
                    tenant={editingTenant}
                    onSave={handleSaveTenant}
                    onClose={() => setIsFormModalOpen(false)}
                />
            </Modal>
        )}
        
        {isPaymentModalOpen && payingTenant && (
            <Modal onClose={() => setIsPaymentModalOpen(false)}>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Log Rent Payment</h3>
                <LogPaymentForm
                    tenant={payingTenant}
                    property={properties.find(p => p.id === payingTenant.property_id)!}
                    onSave={handleSavePayment}
                    onClose={() => setIsPaymentModalOpen(false)}
                />
            </Modal>
        )}

        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => {setIsConfirmModalOpen(false); setDeletingTenantId(null);}}
            onConfirm={handleConfirmDelete}
            title="Delete Tenant"
            message="Are you sure you want to delete this tenant? This action will permanently remove the tenant and cannot be undone."
        />
    </div>
  );
};

export default Tenants;