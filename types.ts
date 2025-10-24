export interface Property {
  id: string;
  address: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  status: 'occupied' | 'vacant';
  tenant_id?: string;
  user_id: string;
}

export interface Tenant {
  id:string;
  name: string;
  email: string;
  phone: string;
  move_in_date: string;
  property_id?: string;
  user_id: string;
}

export enum PaymentStatus {
  Paid = 'Paid',
  Due = 'Due',
  Overdue = 'Overdue',
}

export interface Payment {
    id: string;
    tenant_id: string;
    property_id: string;
    amount: number;
    date: string;
    month: number;
    year: number;
    user_id: string;
}

export interface User {
    id: string;
    name: string;
    email?: string;
}