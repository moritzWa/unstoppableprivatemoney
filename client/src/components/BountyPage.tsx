import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
    return <div className="container px-4 py-8 mx-auto">Loading...</div>;
  }

  if (!bounty) {
    return <div className="container px-4 py-8 mx-auto">Bounty not found</div>;
  }

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 md:col-span-2">
            {/* Header */}
            <div className="flex gap-4 items-start">
              <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-16 h-16 rounded-md bg-muted">
                {logoData ? (
                  <img
                    src={`data:${bounty.organisation.logo?.contentType};base64,${logoData.data}`}
                    alt={`${bounty.organisation.name} logo`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-2xl font-bold text-muted-foreground">
                    {bounty.organisation.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{bounty.name}</h1>
                <a
                  href={`/organisation/${bounty.organisation.id}`}
                  className="text-muted-foreground text-lg pt-4 hover:underline"
                >
                  {bounty.organisation.name}
                </a>
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
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Separator />

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl font-semibold">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {bounty.skills.split(',').map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                    >
                      {skill.trim()}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-xl font-semibold">Details</h2>
                <div className="max-w-none prose dark:prose-invert">
                  <ReactMarkdown>{bounty.details}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prizes */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex gap-3 items-center mb-6">
                <div className="flex justify-center items-center w-8 h-8">
                  <img src="/zcash-zec.svg" alt="ZEC" className="dark:invert" />
                </div>
                <div>
                  <span className="text-2xl font-bold">
                    {bounty.prizes
                      .split(',')
                      .reduce((sum, prize) => sum + parseInt(prize.trim().replace(/,/g, '')), 0)
                      .toLocaleString()}
                  </span>
                  <span className="ml-2 text-xl text-gray-500">
                    {bounty.prizeCurrency || 'ZEC'}
                  </span>
                  <div className="text-gray-500">Total Prizes</div>
                </div>
              </div>
              <div className="relative space-y-4">
                <div className="absolute left-[7px] top-[15px] bottom-[15px] w-[2px] bg-border"></div>
                {bounty.prizes.split(',').map((prize, index) => (
                  <div key={index} className="flex items-center">
                    <div className="relative z-10 mr-6 w-4 h-4 rounded-full bg-border"></div>
                    <div className="flex flex-1 justify-between items-center">
                      <span className="text-lg text-gray-500">
                        {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : '4th'}
                      </span>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">
                          {parseInt(prize.trim()).toLocaleString()}
                        </span>
                        <span className="ml-2 text-lg text-gray-500">
                          {bounty.prizeCurrency || 'ZEC'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 space-y-4 rounded-lg border bg-card">
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
