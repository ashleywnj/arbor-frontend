import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Archive } from 'lucide-react';

export function PortfoliosPage() {
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: api.getPortfolios,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Portfolios</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Portfolio
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  const activePortfolios = portfolios?.filter((p) => p.status === 'active') || [];
  const archivedPortfolios = portfolios?.filter((p) => p.status === 'archived') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolios</h1>
          <p className="text-muted-foreground">
            Manage your project portfolios
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Portfolio
        </Button>
      </div>

      {/* Active Portfolios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activePortfolios.map((portfolio) => (
          <Link key={portfolio.id} to={`/portfolios/${portfolio.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="truncate">{portfolio.name}</span>
                </CardTitle>
                <CardDescription>
                  {portfolio.projects_count} projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.client_name && (
                  <Badge variant="outline" className="mb-2">
                    {portfolio.client_name}
                  </Badge>
                )}
                {portfolio.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {portfolio.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Archived Portfolios */}
      {archivedPortfolios.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-60">
            {archivedPortfolios.map((portfolio) => (
              <Link key={portfolio.id} to={`/portfolios/${portfolio.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="truncate">{portfolio.name}</span>
                      <Archive className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>
                      {portfolio.projects_count} projects
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}