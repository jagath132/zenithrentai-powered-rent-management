

import React, { useState } from 'react';
import { View } from '../App';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PropertiesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const TenantsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a3.001 3.001 0 01-3.712 0M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const PaymentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    const { currentUser, logout } = useAppContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems: { view: View; label: string; icon: React.ReactElement }[] = [
        { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { view: 'properties', label: 'Properties', icon: <PropertiesIcon /> },
        { view: 'tenants', label: 'Tenants', icon: <TenantsIcon /> },
        { view: 'payments', label: 'Payments', icon: <PaymentsIcon /> },
    ];
    
    const navAndProfile = (
        <>
            <nav className="flex-1 mt-6">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => {
                            setCurrentView(item.view);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                            currentView === item.view
                                ? 'bg-primary text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        {item.icon}
                        <span className="ml-4">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="px-4 py-4 border-t border-gray-700">
                <div className="flex items-center">
                    <UserIcon />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                        <p className="text-xs text-gray-400">{currentUser?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className={`flex items-center w-full mt-4 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md`}
                >
                    <LogoutIcon />
                    <span className="ml-4">Logout</span>
                </button>
            </div>
        </>
    );

    const desktopSidebar = (
        <aside className="hidden md:flex flex-col bg-gray-800 text-white w-64">
            <div className="flex flex-col h-full">
                <div className="flex items-center px-4 h-20 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-white">ZenithRent</h1>
                </div>
                {navAndProfile}
            </div>
        </aside>
    );
    
    const mobileSidebar = (
        <>
            {/* Mobile Header Bar */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-800 text-white flex items-center justify-between px-4 z-30 shadow-md">
                <h1 className="text-xl font-bold">ZenithRent</h1>
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2">
                    <MenuIcon />
                </button>
            </header>

            {/* Overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Panel */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 h-16 border-b border-gray-700">
                        <h1 className="text-xl font-bold text-white">ZenithRent</h1>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
                            <CloseIcon />
                        </button>
                    </div>
                    {navAndProfile}
                </div>
            </div>
        </>
    );

    return (
        <>
            {desktopSidebar}
            {mobileSidebar}
        </>
    );
};