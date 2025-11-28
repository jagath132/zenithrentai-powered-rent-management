import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Property, Tenant, Payment, PaymentStatus, User } from "../types";
import { auth, db } from "../lib/firebaseClient";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  sendEmailVerification,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
  getDoc,
} from "firebase/firestore";

interface AppContextType {
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  currentUser: User | null;
  passwordRecoveryMode: boolean;
  error: string | null;
  addProperty: (
    property: Omit<Property, "id" | "status" | "user_id">
  ) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addTenant: (tenant: Omit<Tenant, "id" | "user_id">) => Promise<void>;
  updateTenant: (tenant: Tenant, originalPropertyId?: string) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  assignTenantToProperty: (
    tenantId: string,
    propertyId: string
  ) => Promise<void>;
  unassignTenantFromProperty: (propertyId: string) => Promise<void>;
  logPayment: (payment: Omit<Payment, "id" | "user_id">) => Promise<void>;
  getPaymentStatusForTenant: (
    tenantId: string,
    rent: number
  ) => { status: PaymentStatus; amountDue: number };
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<void>;
  login: (
    credentials: Omit<User, "id" | "name"> & { password: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Check for password recovery mode from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    if (mode === "resetPassword") {
      setPasswordRecoveryMode(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Check if email is verified before allowing access
          if (!user.emailVerified) {
            // Sign out unverified users
            await signOut(auth);
            setFirebaseUser(null);
            setCurrentUser(null);
            setError(
              "Email not confirmed. Please verify your email before logging in."
            );
            return;
          }

          setFirebaseUser(user);
          // Get user profile from Firestore
          const userDocRef = doc(db, "profiles", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setCurrentUser({
              id: user.uid,
              email: user.email || "",
              name: profileData?.name || "",
            });
          } else {
            // Profile doesn't exist yet, create a placeholder
            setCurrentUser({
              id: user.uid,
              email: user.email || "",
              name: "User",
            });
          }
          setPasswordRecoveryMode(false);
          setError(null); // Clear any previous errors
        } else {
          setFirebaseUser(null);
          setCurrentUser(null);
        }
      } catch (e: any) {
        console.error("Error during auth state change:", e);
        setError("Could not fetch user profile.");
        if (user) {
          setCurrentUser({
            id: user.uid,
            email: user.email || "",
            name: "User",
          });
        } else {
          setCurrentUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = useCallback(async () => {
    if (!firebaseUser) {
      setProperties([]);
      setTenants([]);
      setPayments([]);
      return;
    }
    setError(null);
    try {
      const userId = firebaseUser.uid;

      // Fetch properties
      const propertiesQuery = query(
        collection(db, "properties"),
        where("user_id", "==", userId)
      );
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const propertiesData = propertiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];
      setProperties(propertiesData);

      // Fetch tenants
      const tenantsQuery = query(
        collection(db, "tenants"),
        where("user_id", "==", userId)
      );
      const tenantsSnapshot = await getDocs(tenantsQuery);
      const tenantsData = tenantsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tenant[];
      setTenants(tenantsData);

      // Fetch payments
      const paymentsQuery = query(
        collection(db, "payments"),
        where("user_id", "==", userId)
      );
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = paymentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];
      setPayments(paymentsData);
    } catch (e: any) {
      setError(e.message);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  const signup = async (userData: Omit<User, "id"> & { password: string }) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email!,
      userData.password
    );

    // Create user profile in Firestore
    await setDoc(doc(db, "profiles", userCredential.user.uid), {
      name: userData.name,
      email: userData.email,
      created_at: new Date().toISOString(),
    });

    // Send verification email
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}?confirmed=true`,
      });
    }
  };

  const login = async (
    credentials: Omit<User, "id" | "name"> & { password: string }
  ) => {
    await signInWithEmailAndPassword(
      auth,
      credentials.email!,
      credentials.password
    );
    // Email verification check is now handled in onAuthStateChanged listener
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setProperties([]);
      setTenants([]);
      setPayments([]);
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      setCurrentUser(null);
      setProperties([]);
      setTenants([]);
      setPayments([]);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    // For Firebase, we need to sign in first to get the user, then send verification
    // This is a limitation - we'll try to sign in temporarily
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      } else {
        throw new Error(
          "Please try signing in again to resend verification email."
        );
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to resend verification email.");
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin,
    });
  };

  const updatePassword = async (newPassword: string) => {
    if (!auth.currentUser) {
      throw new Error("No user logged in");
    }
    await firebaseUpdatePassword(auth.currentUser, newPassword);
    setPasswordRecoveryMode(false);
    await signOut(auth);
  };

  const addProperty = async (
    propertyData: Omit<Property, "id" | "status" | "user_id">
  ) => {
    if (!currentUser) throw new Error("User not logged in");

    await addDoc(collection(db, "properties"), {
      ...propertyData,
      status: "vacant",
      user_id: currentUser.id,
    });
    fetchData();
  };

  const updateProperty = async (updatedProperty: Property) => {
    const propertyRef = doc(db, "properties", updatedProperty.id);
    const { id, ...propertyData } = updatedProperty;
    await updateDoc(propertyRef, propertyData);
    fetchData();
  };

  const deleteProperty = async (id: string) => {
    await deleteDoc(doc(db, "properties", id));
    fetchData();
  };

  const addTenant = async (tenantData: Omit<Tenant, "id" | "user_id">) => {
    if (!currentUser) throw new Error("User not logged in");

    const docRef = await addDoc(collection(db, "tenants"), {
      ...tenantData,
      user_id: currentUser.id,
    });

    if (tenantData.property_id) {
      const propertyRef = doc(db, "properties", tenantData.property_id);
      await updateDoc(propertyRef, {
        status: "occupied",
        tenant_id: docRef.id,
      });
    }

    fetchData();
  };

  const updateTenant = async (updatedTenant: Tenant) => {
    const originalTenant = tenants.find((t) => t.id === updatedTenant.id);
    if (!originalTenant) return;

    // Property assignment has changed
    if (originalTenant.property_id !== updatedTenant.property_id) {
      // Unassign from old property if it exists
      if (originalTenant.property_id) {
        const oldPropertyRef = doc(
          db,
          "properties",
          originalTenant.property_id
        );
        await updateDoc(oldPropertyRef, {
          status: "vacant",
          tenant_id: null,
        });
      }
      // Assign to new property if it exists
      if (updatedTenant.property_id) {
        const newPropertyRef = doc(db, "properties", updatedTenant.property_id);
        await updateDoc(newPropertyRef, {
          status: "occupied",
          tenant_id: updatedTenant.id,
        });
      }
    }

    const tenantRef = doc(db, "tenants", updatedTenant.id);
    const { id, ...tenantData } = updatedTenant;
    await updateDoc(tenantRef, tenantData);

    fetchData();
  };

  const deleteTenant = async (id: string) => {
    const tenantToDelete = tenants.find((t) => t.id === id);
    if (!tenantToDelete) return;

    // If tenant is assigned to a property, make it vacant
    if (tenantToDelete.property_id) {
      const propertyRef = doc(db, "properties", tenantToDelete.property_id);
      await updateDoc(propertyRef, {
        status: "vacant",
        tenant_id: null,
      });
    }

    await deleteDoc(doc(db, "tenants", id));
    fetchData();
  };

  const assignTenantToProperty = async (
    tenantId: string,
    propertyId: string
  ) => {
    const propertyRef = doc(db, "properties", propertyId);
    await updateDoc(propertyRef, {
      status: "occupied",
      tenant_id: tenantId,
    });

    const tenantRef = doc(db, "tenants", tenantId);
    await updateDoc(tenantRef, {
      property_id: propertyId,
    });

    fetchData();
  };

  const unassignTenantFromProperty = async (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property || !property.tenant_id) return;
    const tenantId = property.tenant_id;

    const propertyRef = doc(db, "properties", propertyId);
    await updateDoc(propertyRef, {
      status: "vacant",
      tenant_id: null,
    });

    const tenantRef = doc(db, "tenants", tenantId);
    await updateDoc(tenantRef, {
      property_id: null,
    });

    fetchData();
  };

  const logPayment = async (paymentData: Omit<Payment, "id" | "user_id">) => {
    if (!currentUser) throw new Error("User not logged in");

    await addDoc(collection(db, "payments"), {
      ...paymentData,
      user_id: currentUser.id,
    });
    fetchData();
  };

  const getPaymentStatusForTenant = useCallback(
    (
      tenantId: string,
      rent: number
    ): { status: PaymentStatus; amountDue: number } => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const paymentThisMonth = payments.find(
        (p) =>
          p.tenant_id === tenantId &&
          p.month === currentMonth &&
          p.year === currentYear
      );

      if (paymentThisMonth) {
        return { status: PaymentStatus.Paid, amountDue: 0 };
      }

      return { status: PaymentStatus.Overdue, amountDue: rent };
    },
    [payments]
  );

  return (
    <AppContext.Provider
      value={{
        properties,
        tenants,
        payments,
        currentUser,
        passwordRecoveryMode,
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
        sendPasswordResetEmail: sendPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
