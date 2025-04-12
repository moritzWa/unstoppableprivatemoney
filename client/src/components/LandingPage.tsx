import React from 'react';
import { trpc } from '../utils/trpc';
import BountyListItem from './BountyListItem';

interface LandingPageProps {
  landingPageKeyword?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ landingPageKeyword }) => {
  const { data: bounties, isLoading } = trpc.bounty.getAll.useQuery();
  const token = localStorage.getItem('accessToken');

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* hero section */}
      <div className="w-full text-center py-12 md:py-16 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">Zcash Bounties</h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover and complete bounties on Zcash. Join our community of contributors and earn
          rewards.
        </p>

        {/* <div className="flex justify-center mt-6">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            onClick={() => navigate('/create-bounty')}
          >
            Create Bounty
          </Button>
        </div> */}
      </div>

      {/* All Open Bounties */}
      <div className="mt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">All Open</h2>

        {isLoading ? (
          <div className="text-center py-8">Loading bounties...</div>
        ) : !bounties || bounties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bounties available at the moment. Be the first to create one!
          </div>
        ) : (
          <div className="space-y-4">
            {bounties.map((bounty) => (
              <BountyListItem
                key={bounty.id}
                id={bounty.id}
                name={bounty.name}
                organisation={bounty.organisation}
                dueIn={undefined}
                prize={{
                  amount: bounty.prizes.split(',')[0].trim(),
                  currency: bounty.prizeCurrency,
                }}
                isLoggedIn={!!token}
              />
            ))}
          </div>
        )}
      </div>

      {/* footer section */}
      <div className="flex flex-row items-center justify-center mt-12 mb-8">
        <p className="text-muted-foreground">© 2025 Unstoppable Private Money</p>
      </div>
    </div>
  );
};

export default LandingPage;
