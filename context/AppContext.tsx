
import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { Property, Tenant, Payment, PaymentStatus, User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';


interface AppContextType {
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  currentUser: User | null;
  passwordRecoverySession: Session | null;
  loading: boolean;
  error: string | null;
  addProperty: (property: Omit<Property, 'id' | 'status' | 'user_id'>) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addTenant: (tenant: Omit<Tenant, 'id' | 'user_id'>) => Promise<void>;
  updateTenant: (tenant: Tenant, originalPropertyId?: string) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  assignTenantToProperty: (tenantId: string, propertyId: string) => Promise<void>;
  unassignTenantFromProperty: (propertyId: string) => Promise<void>;
  logPayment: (payment: Omit<Payment, 'id' | 'user_id'>) => Promise<void>;
  getPaymentStatusForTenant: (tenantId: string, rent: number) => { status: PaymentStatus, amountDue: number };
  signup: (userData: Omit<User, 'id'> & {password: string}) => Promise<void>;
  login: (credentials: Omit<User, 'id' | 'name'> & {password: string}) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordRecoverySession, setPasswordRecoverySession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
            if (event === 'PASSWORD_RECOVERY') {
                setPasswordRecoverySession(session);
                setCurrentUser(null);
            } else if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('name')
                    .eq('id', session.user.id)
                    .single();
                setCurrentUser({ id: session.user.id, email: session.user.email, name: profile?.name || '' });
                setPasswordRecoverySession(null);
            } else {
                setCurrentUser(null);
                setPasswordRecoverySession(null);
            }
        } catch (e: any) {
            console.error("Error during auth state change:", e);
            setError("Could not fetch user profile.");
            // Still set user to show the app, even if profile fetch fails
            if (session?.user) {
                 setCurrentUser({ id: session.user.id, email: session.user.email, name: 'User' });
            } else {
                setCurrentUser(null);
            }
            setPasswordRecoverySession(null);
        } finally {
            setLoading(false);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async () => {
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
        setProperties([]);
        setTenants([]);
        setPayments([]);
        return;
    };
    setError(null);
    try {
        const userId = session.data.session.user.id;
        const { data: propertiesData, error: propertiesError } = await supabase.from('properties').select('*').eq('user_id', userId);
        if (propertiesError) throw propertiesError;
        setProperties(propertiesData);

        const { data: tenantsData, error: tenantsError } = await supabase.from('tenants').select('*').eq('user_id', userId);
        if (tenantsError) throw tenantsError;
        setTenants(tenantsData);

        const { data: paymentsData, error: paymentsError } = await supabase.from('payments').select('*').eq('user_id', userId);
        if (paymentsError) throw paymentsError;
        setPayments(paymentsData);

    } catch (e: any) {
        setError(e.message);
    }
  }, []);

  useEffect(() => {
      if(currentUser){
        fetchData();
      }
  }, [currentUser, fetchData]);

  const signup = async (userData: Omit<User, 'id'> & {password: string}) => {
    const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password,
        options: {
            data: {
                name: userData.name
            },
            emailRedirectTo: window.location.origin
        }
    });
    if (error) throw error;
    // The user will be sent a confirmation email.
  };
  
  const login = async (credentials: Omit<User, 'id' | 'name'> & {password: string}) => {
    const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email!,
        password: credentials.password
    });
    if (error) throw error;
    // The onAuthStateChange listener will handle setting the user and fetching data
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
    setProperties([]);
    setTenants([]);
    setPayments([]);
  };

  const resendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
    });
    if (error) throw error;
  };

  const sendPasswordResetEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    setPasswordRecoverySession(null);
  };
  
  const addProperty = async (propertyData: Omit<Property, 'id' | 'status' | 'user_id'>) => {
    if (!currentUser) throw new Error("User not logged in");
    const { error } = await supabase.from('properties').insert([{ ...propertyData, status: 'vacant', user_id: currentUser.id }]);
    if (error) throw error;
    fetchData();
  };

  const updateProperty = async (updatedProperty: Property) => {
    const { error } = await supabase.from('properties').update(updatedProperty).eq('id', updatedProperty.id);
    if (error) throw error;
    fetchData();
  };
  
  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
    fetchData();
  };

  const addTenant = async (tenantData: Omit<Tenant, 'id' | 'user_id'>) => {
    if (!currentUser) throw new Error("User not logged in");

    const { data: newTenant, error } = await supabase
        .from('tenants')
        .insert([{ ...tenantData, user_id: currentUser.id }])
        .select()
        .single();
        
    if (error) throw error;
    
    if (newTenant?.property_id) {
        await supabase
            .from('properties')
            .update({ status: 'occupied', tenant_id: newTenant.id })
            .eq('id', newTenant.property_id);
    }
    
    fetchData();
  };

  const updateTenant = async (updatedTenant: Tenant) => {
    const originalTenant = tenants.find(t => t.id === updatedTenant.id);
    if (!originalTenant) return;

    // Property assignment has changed
    if (originalTenant.property_id !== updatedTenant.property_id) {
        // Unassign from old property if it exists
        if (originalTenant.property_id) {
            await supabase
                .from('properties')
                .update({ status: 'vacant', tenant_id: null })
                .eq('id', originalTenant.property_id);
        }
        // Assign to new property if it exists
        if (updatedTenant.property_id) {
            await supabase
                .from('properties')
                .update({ status: 'occupied', tenant_id: updatedTenant.id })
                .eq('id', updatedTenant.property_id);
        }
    }

    const { error } = await supabase.from('tenants').update(updatedTenant).eq('id', updatedTenant.id);
    if (error) throw error;
    
    fetchData();
  };

  const deleteTenant = async (id: string) => {
    const tenantToDelete = tenants.find(t => t.id === id);
    if (!tenantToDelete) return;

    // If tenant is assigned to a property, make it vacant
    if (tenantToDelete.property_id) {
        await supabase
            .from('properties')
            .update({ status: 'vacant', tenant_id: null })
            .eq('id', tenantToDelete.property_id);
    }
    
    const { error } = await supabase.from('tenants').delete().eq('id', id);
    if (error) throw error;
    
    fetchData();
  };

  const assignTenantToProperty = async (tenantId: string, propertyId: string) => {
    const { error: propError } = await supabase.from('properties').update({ status: 'occupied', tenant_id: tenantId }).eq('id', propertyId);
    if(propError) throw propError;
    const { error: tenantError } = await supabase.from('tenants').update({ property_id: propertyId }).eq('id', tenantId);
    if(tenantError) throw tenantError;
    fetchData();
  };
  
  const unassignTenantFromProperty = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property || !property.tenant_id) return;
    const tenantId = property.tenant_id;

    await supabase.from('properties').update({ status: 'vacant', tenant_id: null }).eq('id', propertyId);
    await supabase.from('tenants').update({ property_id: null }).eq('id', tenantId);

    fetchData();
  };

  const logPayment = async (paymentData: Omit<Payment, 'id'| 'user_id'>) => {
    if (!currentUser) throw new Error("User not logged in");
    const { error } = await supabase.from('payments').insert([{ ...paymentData, user_id: currentUser.id }]);
    if (error) throw error;
    fetchData();
  };

  const getPaymentStatusForTenant = useCallback((tenantId: string, rent: number): { status: PaymentStatus, amountDue: number } => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const paymentThisMonth = payments.find(p => p.tenant_id === tenantId && p.month === currentMonth && p.year === currentYear);

    if (paymentThisMonth) {
        return { status: PaymentStatus.Paid, amountDue: 0 };
    }
    
    return { status: PaymentStatus.Overdue, amountDue: rent };
  }, [payments]);

  return (
    <AppContext.Provider value={{
      properties,
      tenants,
      payments,
      currentUser,
      passwordRecoverySession,
      loading,
      error,
      addProperty,
      updateProperty,
      deleteProperty,
      addTenant,
      updateTenant,
      deleteTenant,
      assignTenantToProperty,
      unassignTenantFromProperty,
      logPayment,
      getPaymentStatusForTenant,
      signup,
      login,
      logout,
      resendVerificationEmail,
      sendPasswordResetEmail,
      updatePassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
