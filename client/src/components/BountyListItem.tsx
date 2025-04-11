import { Clock, CloudLightning } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

// This should match exactly what the server returns
export interface BountyData {
  id: string;
  name: string;
  organisation: {
    id: string;
    name: string;
    logo?: {
      contentType: string;
    };
  };
  submitLink: string;
  contactLink: string;
  skills: string;
  prizes: string;
  prizeCurrency: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

// Component props can extend from the base data type
interface BountyListItemProps {
  id: string;
  name: string;
  organisation: BountyData['organisation']; // Use the exact type from the server
  dueIn?: string;
  prize?: {
    amount: string;
    currency: string;
  };
}

const BountyListItem: React.FC<BountyListItemProps> = ({
  id,
  name,
  organisation,
  dueIn,
  prize,
}) => {
  return (
    <div className="flex items-start p-4 gap-4 bg-card hover:bg-accent/10 rounded-lg transition-colors">
      {/* Organization Logo */}
      <div className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
        {organisation.logo ? (
          <img
            src={`/api/organisations/${organisation.id}/logo`}
            alt={`${organisation.name} logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-2xl font-bold text-muted-foreground">
            {organisation.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <Link to={`/bounty/${id}`} className="hover:underline">
          <h2 className="text-lg font-semibold">{name}</h2>
        </Link>
        <div className="text-sm text-muted-foreground">{organisation.name}</div>

        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CloudLightning size={16} className="mr-1" />
            <span>Bounty</span>
          </div>

          {dueIn && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={16} className="mr-1" />
              <span>Due in {dueIn}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prize */}
      {prize && (
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-lg font-semibold">{prize.amount}</span>
            <span className="ml-2 text-sm text-muted-foreground">{prize.currency}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BountyListItem;
