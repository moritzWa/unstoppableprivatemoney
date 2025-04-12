import { useParams } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { AppLayout } from './AppLayout';
import BountyListItem, { BountyData } from './BountyListItem';

interface Organisation {
  id: string;
  name: string;
  logo?: {
    contentType: string;
  };
  contactLink?: string;
  bounties: BountyData[];
  createdAt: string;
  updatedAt: string;
}

export const OrganisationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: org, isLoading } = trpc.organisation.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  );
  const { data: logoData } = trpc.organisation.getLogo.useQuery(
    { id: id! },
    { enabled: !!id && !!org?.logo }
  );

  console.log('Organisation data:', org);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container px-4 py-8 mx-auto">Loading...</div>
      </AppLayout>
    );
  }

  if (!org) {
    return (
      <AppLayout>
        <div className="container px-4 py-8 mx-auto">Organization not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex gap-6 items-center mb-8">
          <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-24 h-24 rounded-lg bg-muted">
            {org.logo && logoData ? (
              <img
                src={`data:${org.logo.contentType};base64,${logoData.data}`}
                alt={`${org.name} logo`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-4xl font-bold text-muted-foreground">{org.name.charAt(0)}</div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{org.name}</h1>
            {org.contactLink && (
              <a
                href={org.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Contact Organization
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Bounties</h2>
          {org.bounties && org.bounties.length > 0 ? (
            <div className="grid gap-4">
              {org.bounties.map((bounty) => (
                <BountyListItem key={bounty.id} {...bounty} organisation={org} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No bounties available yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganisationPage;
