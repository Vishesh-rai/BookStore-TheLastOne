import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { LibraryBig, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="h-20 border-b border-black/5 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
            <LibraryBig size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">BookStore</h1>
        </Link>
      </div>

      <div className="flex items-center gap-6 flex-1 justify-end">
        <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full border border-black/5 w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search your library..." 
            className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 border-l border-black/5 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome</p>
            <p className="text-sm font-bold">{user?.name || 'Guest User'}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center text-primary font-bold text-sm">
            {user?.name?.substring(0, 2).toUpperCase() || 'GS'}
          </div>
        </div>
      </div>
    </nav>
  );
}
