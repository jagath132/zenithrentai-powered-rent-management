
import React from 'react';
import { Sidebar } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
import Tenants from './components/Tenants';
import Payments from './components/Payments';
import { AppProvider, useAppContext } from './context/AppContext';
import Auth from './components/auth/Auth';
import UpdatePassword from './components/auth/UpdatePassword';

export type View = 'dashboard' | 'properties' | 'tenants' | 'payments';

const MainApp: React.FC = () => {
    const { currentUser, loading, passwordRecoverySession } = useAppContext();
    const [currentView, setCurrentView] = React.useState<View>('dashboard');

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div>Loading...</div></div>;
    }

    if (passwordRecoverySession) {
        return <UpdatePassword />;
    }

    if (!currentUser) {
        return <Auth />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard />;
            case 'properties':
                return <Properties />;
            case 'tenants':
                return <Tenants />;
            case 'payments':
                return <Payments />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </div>
            </main>
        </div>
    );
}


const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;