import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  prizes: string;
  prizeCurrency: string;
  isLoggedIn?: boolean;
}

const BountyListItem: React.FC<BountyListItemProps> = ({
  id,
  name,
  prizes,
  prizeCurrency,
  organisation,
  dueIn,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const deleteBounty = trpc.bounty.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Bounty deleted successfully',
      });
      // You might want to refresh the bounties list here
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this bounty?')) {
      deleteBounty.mutate({ id });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edit-bounty/${id}`);
  };

  // Query for the logo
  const { data: logoData } = trpc.organisation.getLogo.useQuery(
    { id: organisation.id },
    { enabled: !!organisation.logo } // Only fetch if org has a logo
  );

  const totalPrice = prizes.split(',').reduce((acc, curr) => acc + parseFloat(curr.trim()), 0);

  return (
    <Link to={`/bounty/${id}`} className="no-underline">
      <div className="flex gap-4 items-start p-4 rounded-lg transition-colors cursor-pointer bg-card hover:bg-accent">
        {/* Organization Logo */}
        <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-16 h-16 rounded-md bg-muted">
          {logoData ? (
            <img
              src={`data:${organisation.logo?.contentType};base64,${logoData.data}`}
              alt={`${organisation.name} logo`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-2xl font-bold no-underline text-muted-foreground">
              {organisation.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold hover:underline">{name}</h2>
          <div className="text-sm text-muted-foreground">{organisation.name}</div>

          <div className="flex gap-6 items-center mt-2">
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
        {prizes && (
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className="text-lg font-semibold">{totalPrice}</span>
              <span className="ml-2 text-sm text-muted-foreground">{prizeCurrency}</span>
            </div>
          </div>
        )}
      </div>
      {isLoggedIn && (
        <div className="flex gap-2 py-2 ml-4">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
          <p className="text-xs text-muted-foreground">only visible to you/admins</p>
        </div>
      )}
    </Link>
  );
};

export default BountyListItem;
