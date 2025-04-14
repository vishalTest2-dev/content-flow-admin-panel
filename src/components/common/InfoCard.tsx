
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  link?: {
    url: string;
    text: string;
  };
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon: Icon, color, link }) => {
  return (
    <div className="admin-info-card">
      <div 
        className="admin-info-card-icon"
        style={{ backgroundColor: color }}
      >
        <Icon size={24} />
      </div>
      <div className="admin-info-card-content">
        <div className="admin-info-card-title">{title}</div>
        <div className="admin-info-card-value">{value}</div>
        {link && (
          <Link 
            to={link.url} 
            className="admin-info-card-link"
          >
            {link.text}
          </Link>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
