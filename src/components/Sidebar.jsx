import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Download, Upload, LogOut, TrendingUp, Target } from 'lucide-react';
import { useAuth } from './AuthContext';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Wishlist', icon: Heart, path: '/wishlist', visibility: ['reader', 'author'] },
    { name: 'Upload', icon: Upload, path: '/upload', visibility: ['author'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.visibility || (user && item.visibility.includes(user.role))
  );

  return (
    <aside className="w-64 hidden lg:flex flex-col gap-2 p-6 h-[calc(100vh-80px)] sticky top-20 bg-background uppercase">
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => console.log(`[Sidebar] Navigating to: ${item.name}`)}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 active:scale-95 group",
            isActive 
              ? "bg-primary text-white shadow-lg shadow-indigo-100" 
              : "text-gray-400 hover:bg-gray-50 hover:text-foreground"
          )}
        >
          <item.icon size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs tracking-tight">{item.name}</span>
        </NavLink>
      ))}

      <div className="mt-8 p-6 bg-white border border-black/5 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <TrendingUp size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Progress</span>
        </div>
        <p className="text-xs font-black mb-3">{user?.downloads?.length || 0}/12 READ</p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000" 
            style={{ width: `${Math.min(((user?.downloads?.length || 0) / 12) * 100, 100)}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          console.log('[Sidebar] Logout clicked');
          logout();
        }}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-xs cursor-pointer active:scale-95"
      >
        <LogOut size={20} />
        LOGOUT
      </button>
    </aside>
  );
}
