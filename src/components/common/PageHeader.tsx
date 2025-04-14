
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b">
      <div className="flex items-center mb-4 sm:mb-0">
        {Icon && (
          <div className="mr-3 p-2 bg-admin-primary rounded-md text-white">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
