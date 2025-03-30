import React from 'react';
import { useAuth } from '@/hooks/use-auth';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onMenuClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <div className="ml-4 relative flex-shrink-0">
              <div className="flex items-center relative group">
                <div className="hidden md:block mr-3">
                  <p className="text-sm font-medium text-neutral-700">{user?.fullName || ''}</p>
                  <p className="text-xs text-neutral-500">{user?.specialty || user?.role || ''}</p>
                </div>
                <button className="flex rounded-full bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <img className="h-8 w-8 rounded-full" src={user?.profileImage || 'https://via.placeholder.com/100'} alt="User profile" />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                  <div className="py-1">
                    <a href="#profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Your Profile</a>
                    <a href="#settings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Settings</a>
                    <button 
                      onClick={() => logoutMutation.mutate()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
