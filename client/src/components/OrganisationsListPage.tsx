import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { AppLayout } from './AppLayout';
import { Button } from './ui/button';

const OrganisationCard = ({ org }: { org: any }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem('accessToken');

  const { data: logoData } = trpc.organisation.getLogo.useQuery(
    { id: org.id },
    { enabled: !!org.logo }
  );

  const utils = trpc.useContext();

  const deleteOrganisation = trpc.organisation.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Organisation deleted successfully',
      });
      // The query will need to be invalidated to refresh the list
      utils.organisation.getAll.invalidate();
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this organisation?')) {
      deleteOrganisation.mutate({ id: org.id });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-organisation/${org.id}`);
  };

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

      {token && (
        <div className="flex gap-2 mt-4">
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
