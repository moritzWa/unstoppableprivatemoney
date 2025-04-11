import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { AppLayout } from './AppLayout';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const BountyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bounty, isLoading } = trpc.bounty.getById.useQuery({ id: id! });
  const { data: logoData } = trpc.organisation.getLogo.useQuery(
    { id: bounty?.organisation.id ?? '' },
    { enabled: !!bounty?.organisation.logo }
  );

  const { toast } = useToast();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!bounty) {
    return <div className="container mx-auto px-4 py-8">Bounty not found</div>;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                {logoData ? (
                  <img
                    src={`data:${bounty.organisation.logo?.contentType};base64,${logoData.data}`}
                    alt={`${bounty.organisation.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-bold text-muted-foreground">
                    {bounty.organisation.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{bounty.name}</h1>
                <p className="text-muted-foreground">{bounty.organisation.name}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: 'Copied Bounty Link to clipboard',
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About {bounty.organisation.name}</h2>
                <p className="text-muted-foreground">
                  A decentralized organization focused on advancing blockchain technology.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <p className="whitespace-pre-wrap">{bounty.details}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {bounty.skills.split(',').map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {skill.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prizes */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Prizes</h2>
              <div className="space-y-3">
                {bounty.prizes.split(',').map((prize, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'} place
                    </span>
                    <span className="font-semibold">
                      {prize.trim()} {bounty.prizeCurrency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  window.open(bounty.submitLink, '_blank');
                }}
              >
                Submit Work
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => {
                  window.open(bounty.contactLink, '_blank');
                }}
              >
                Contact Organizer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BountyPage;
