import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus } from 'lucide-react';

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = parseInt(id!);

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio', portfolioId],
    queryFn: () => api.getPortfolio(portfolioId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="animate-pulse h-96" />
      </div>
    );
  }

  if (!portfolio) {
    return <div>Portfolio not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/portfolios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{portfolio.name}</h1>
            <p className="text-muted-foreground">
              {portfolio.projects?.length || 0} projects
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {portfolio.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{portfolio.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.projects?.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge
                    variant={
                      project.rag_status === 'red'
                        ? 'red'
                        : project.rag_status === 'amber'
                        ? 'amber'
                        : 'green'
                    }
                  >
                    {project.rag_status}
                  </Badge>
                </div>
                <CardDescription>
                  {project.total_tasks} tasks · {project.completed_tasks} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.client_name && (
                  <p className="text-sm text-muted-foreground">
                    Client: {project.client_name}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}