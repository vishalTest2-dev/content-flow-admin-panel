
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  ClipboardList, 
  Tag, 
  FileText, 
  Folder, 
  Link, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { title: 'Quiz', icon: ClipboardList, path: '/quiz' },
  { title: 'Quiz Category', icon: Tag, path: '/quiz-category' },
  { title: 'Post', icon: FileText, path: '/blog' },
  { title: 'Post Category', icon: Folder, path: '/blog-category' },
  { title: 'All Links', icon: Link, path: '/links' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button - visible on small screens */}
      <button 
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-admin-primary rounded-md text-white"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar - hidden on small screens unless opened */}
      <aside 
        className={`bg-sidebar fixed h-full z-40 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <h1 className={`text-white font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
            Admin Panel
          </h1>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-white hover:bg-sidebar-accent hidden md:block"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          <button 
            onClick={toggleMobileSidebar}
            className="p-1 rounded-md text-white hover:bg-sidebar-accent md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-2">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.title}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center w-full p-3 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-sidebar-primary text-white' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
                  >
                    <Icon size={20} />
                    <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
