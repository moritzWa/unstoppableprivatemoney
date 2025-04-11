import { Clock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../utils/trpc';

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
  // Query for the logo
  const { data: logoData } = trpc.organisation.getLogo.useQuery(
    { id: organisation.id },
    { enabled: !!organisation.logo } // Only fetch if org has a logo
  );

  return (
    <Link to={`/bounty/${id}`} className="no-underline">
      <div className="flex cursor-pointer items-start p-4 gap-4 bg-card hover:bg-accent rounded-lg transition-colors">
        {/* Organization Logo */}
        <div className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
          {logoData ? (
            <img
              src={`data:${organisation.logo?.contentType};base64,${logoData.data}`}
              alt={`${organisation.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-2xl no-underline font-bold text-muted-foreground">
              {organisation.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold hover:underline">{name}</h2>
          <div className="text-sm text-muted-foreground">{organisation.name}</div>

          <div className="flex items-center gap-6 mt-2">
            {/* <div className="flex items-center text-sm text-muted-foreground">
            <CloudLightning size={16} className="mr-1" />
            <span>Bounty</span>
          </div> */}

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
    </Link>
  );
};

export default BountyListItem;
