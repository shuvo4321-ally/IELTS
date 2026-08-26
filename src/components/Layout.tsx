import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn', path: '/learn', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#1A1F2C] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#E5E2D9] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[#0F172A] font-bold tracking-tight text-xl">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          IELTS Core
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#64748B]">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-[280px] bg-white border-r border-[#E5E2D9] transition-transform duration-200 ease-in-out flex flex-col`}>
        <div className="p-6 hidden md:block border-b border-[#E5E2D9]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">IELTS Core</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border border-[#DBEAFE]' 
                    : 'text-[#475569] hover:bg-gray-50 opacity-60'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[#E5E2D9]">
          <button 
            onClick={signOut}
            className="w-full text-left px-3 py-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-60px)] md:h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
