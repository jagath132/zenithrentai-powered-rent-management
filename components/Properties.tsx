

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Property, Tenant } from '../types';
import { Modal, ConfirmationModal } from './ui/Modal';

const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M19.5,8h-15C3.67,8,3,8.67,3,9.5v5C3,15.33,3.67,16,4.5,16H5v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1h6v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1h0.5c0.83,0,1.5-0.67,1.5-1.5v-5C20,8.67,19.33,8,19.5,8z M6,12H5c-0.55,0-1-0.45-1-1s0.45-1,1-1h1V12z M16,12h-1v-2h1c0.55,0,1,0.45,1,1S16.55,12,16,12z" /></svg>;
const BathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18,3H6C4.9,3,4,3.9,4,5v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,17H6V5h12V17z M8.5,12H10v1.5c0,0.83,0.67,1.5,1.5,1.5S13,14.33,13,13.5V12h1.5c0.83,0,1.5-0.67,1.5-1.5S15.33,9,14.5,9h-6C7.67,9,7,9.67,7,10.5S7.67,12,8.5,12z M5,1H3C2.45,1,2,1.45,2,2s0.45,1,1,1h2V1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const PropertyCard: React.FC<{ property: Property, onEdit: () => void; onDelete: () => void, onAssign: () => void; onUnassign: () => void }> = ({ property, onEdit, onDelete, onAssign, onUnassign }) => {
  const { tenants } = useAppContext();
  const tenant = tenants.find(t => t.id === property.tenant_id);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start">
                <p className="text-xl font-bold text-gray-800 leading-tight">{property.address}</p>
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${property.status === 'occupied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {property.status}
                </span>
            </div>
            <p className="text-primary font-semibold text-lg mt-2">₹{property.rent.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <div className="flex items-center text-gray-600 mt-4">
                <div className="flex items-center mr-4"><BedIcon/> {property.bedrooms} beds</div>
                <div className="flex items-center"><BathIcon/> {property.bathrooms} baths</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700">Tenant</h4>
                {tenant ? (
                    <div className="mt-2 text-gray-600">
                        <p>{tenant.name}</p>
                        <p className="text-sm">{tenant.email}</p>
                    </div>
                ) : (
                    <p className="mt-2 text-gray-500 italic">No tenant assigned</p>
                )}
            </div>
        </div>
        <div className="bg-gray-50 p-4 flex justify-between items-center">
             {property.status === 'occupied' ? (
                <button onClick={onUnassign} className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">Unassign</button>
            ) : (
                <button onClick={onAssign} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Assign Tenant</button>
            )}
            <div className="flex space-x-2">
                <button onClick={onEdit} className="text-gray-400 hover:text-primary p-2 rounded-full transition-colors"><EditIcon /></button>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"><DeleteIcon /></button>
            </div>
        </div>
    </div>
  )
}

const PropertyForm: React.FC<{ property?: Property, onSave: (property: Omit<Property, 'id' | 'status' | 'user_id'> | Property) => void, onClose: () => void }> = ({ property, onSave, onClose }) => {
    const [address, setAddress] = useState(property?.address || '');
    const [rent, setRent] = useState(property?.rent || 0);
    const [bedrooms, setBedrooms] = useState(property?.bedrooms || 0);
    const [bathrooms, setBathrooms] = useState(property?.bathrooms || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const propertyData = { address, rent, bedrooms, bathrooms };
        if (property) {
            onSave({ ...property, ...propertyData });
        } else {
            onSave(propertyData as Omit<Property, 'id' | 'status' | 'user_id'>);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rent (₹)</label>
                    <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                    <input type="number" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                    <input type="number" step="0.5" value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Save Property</button>
            </div>
        </form>
    )
}

const AssignTenantForm: React.FC<{ property: Property, onAssign: (tenantId: string, propertyId: string) => void, onClose: () => void }> = ({ property, onAssign, onClose }) => {
    const { tenants } = useAppContext();
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const availableTenants = tenants.filter(t => !t.property_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedTenantId) return;
        onAssign(selectedTenantId, property.id);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <h3 className="text-lg font-medium leading-6 text-gray-900">Assign tenant to {property.address}</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700">Available Tenants</label>
                {availableTenants.length > 0 ? (
                    <select value={selectedTenantId} onChange={e => setSelectedTenantId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="">Select a tenant</option>
                        {availableTenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                ) : (
                    <p className="text-gray-500 mt-2">No available tenants to assign.</p>
                )}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                {availableTenants.length > 0 && <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Assign Tenant</button>}
            </div>
        </form>
    )
}


const Properties: React.FC = () => {
  const { properties, addProperty, updateProperty, deleteProperty, assignTenantToProperty, unassignTenantFromProperty } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);
  const [assigningProperty, setAssigningProperty] = useState<Property | undefined>(undefined);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  const [isUnassignConfirmOpen, setIsUnassignConfirmOpen] = useState(false);
  const [unassigningPropertyId, setUnassigningPropertyId] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingProperty(undefined);
    setIsModalOpen(true);
  }

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  }

  const handleAssignClick = (property: Property) => {
    setAssigningProperty(property);
    setIsAssignModalOpen(true);
  }
  
  const handleUnassignClick = (propertyId: string) => {
    setUnassigningPropertyId(propertyId);
    setIsUnassignConfirmOpen(true);
  }

  const handleConfirmUnassign = () => {
    if (unassigningPropertyId) {
        unassignTenantFromProperty(unassigningPropertyId);
    }
  }

  const handleDeleteClick = (id: string) => {
      setDeletingPropertyId(id);
      setIsDeleteConfirmOpen(true);
  }

  const handleConfirmDelete = () => {
      if (deletingPropertyId) {
          deleteProperty(deletingPropertyId);
      }
  }

  const handleSaveProperty = (propertyData: Omit<Property, 'id' | 'status' | 'user_id'> | Property) => {
      if ('id' in propertyData) {
          updateProperty(propertyData as Property);
      } else {
          addProperty(propertyData as Omit<Property, 'id' | 'status' | 'user_id'>);
      }
      setIsModalOpen(false);
  }
  
  const handleAssignTenant = (tenantId: string, propertyId: string) => {
    assignTenantToProperty(tenantId, propertyId);
    setIsAssignModalOpen(false);
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
            <button onClick={handleAddClick} className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark shadow transition-colors">
                <AddIcon />
                Add Property
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(prop => (
                <PropertyCard 
                    key={prop.id} 
                    property={prop} 
                    onEdit={() => handleEditClick(prop)}
                    onDelete={() => handleDeleteClick(prop.id)}
                    onAssign={() => handleAssignClick(prop)}
                    onUnassign={() => handleUnassignClick(prop.id)}
                />
            ))}
        </div>

        {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
                <PropertyForm 
                    property={editingProperty}
                    onSave={handleSaveProperty}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        )}
        
        {isAssignModalOpen && assigningProperty && (
            <Modal onClose={() => setIsAssignModalOpen(false)}>
                <AssignTenantForm
                    property={assigningProperty}
                    onAssign={handleAssignTenant}
                    onClose={() => setIsAssignModalOpen(false)}
                />
            </Modal>
        )}

        <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Property"
            message="Are you sure you want to delete this property? This action will permanently remove the property and cannot be undone."
        />

        <ConfirmationModal
            isOpen={isUnassignConfirmOpen}
            onClose={() => setIsUnassignConfirmOpen(false)}
            onConfirm={handleConfirmUnassign}
            title="Unassign Tenant"
            message="Are you sure you want to unassign the tenant from this property?"
            confirmText="Unassign"
            confirmButtonColor="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
        />
    </div>
  );
};

export default Properties;