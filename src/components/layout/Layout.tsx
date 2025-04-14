
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
