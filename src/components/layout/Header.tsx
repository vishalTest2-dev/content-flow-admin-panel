
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Bell
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const [notifications] = useState<{ id: number; message: string }[]>([
    { id: 1, message: 'New blog post added' },
    { id: 2, message: 'Quiz category updated' }
  ]);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-4 py-2 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="py-2">
                  {notification.message}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-admin-primary flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <span className="hidden sm:inline font-medium">Admin User</span>
              <ChevronDown size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User size={16} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/change-password')}>
              <Settings size={16} className="mr-2" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
