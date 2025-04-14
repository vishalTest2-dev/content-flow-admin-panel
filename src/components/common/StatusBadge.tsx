
import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'draft' | string;
}

const statusClassMap: Record<string, string> = {
  active: 'admin-status-active',
  inactive: 'admin-status-inactive',
  draft: 'admin-status-draft',
};

const statusTextMap: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.toLowerCase();
  
  return (
    <span className={`admin-status-badge ${statusClassMap[normalizedStatus] || 'bg-gray-100 text-gray-800'}`}>
      {statusTextMap[normalizedStatus] || status}
    </span>
  );
};

export default StatusBadge;
