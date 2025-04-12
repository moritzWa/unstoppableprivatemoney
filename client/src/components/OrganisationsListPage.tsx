import { Link } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { AppLayout } from './AppLayout';

const OrganisationCard = ({ org }: { org: any }) => {
  const { data: logoData } = trpc.organisation.getLogo.useQuery(
    { id: org.id },
    { enabled: !!org.logo }
  );

  return (
    <Link
      key={org.id}
      to={`/organisation/${org.id}`}
      className="flex flex-col p-6 rounded-lg transition-colors hover:bg-muted"
    >
      <div className="flex gap-4 items-center">
        <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-16 h-16 rounded-md bg-muted">
          {logoData ? (
            <img
              src={`data:${org.logo.contentType};base64,${logoData.data}`}
              alt={`${org.name} logo`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-2xl font-bold text-muted-foreground">{org.name.charAt(0)}</div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{org.name}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(org.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

const OrganisationsListPage = () => {
  const { data: organisations, isLoading } = trpc.organisation.getAll.useQuery();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container px-4 py-8 mx-auto">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Organizations</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organisations?.map((org) => <OrganisationCard key={org.id} org={org} />)}
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganisationsListPage;
