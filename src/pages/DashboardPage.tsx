import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-gray-100" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your projects and tasks</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.my_tasks.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboard.my_tasks.overdue} overdue, {dashboard.my_tasks.due_soon} due soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboard.my_tasks.overdue}
            </div>
            <p className="text-xs text-muted-foreground">Tasks past due date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {dashboard.my_tasks.due_soon}
            </div>
            <p className="text-xs text-muted-foreground">Within next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.my_tasks.blocked}</div>
            <p className="text-xs text-muted-foreground">Tasks with issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* At Risk Projects */}
        <Card>
          <CardHeader>
            <CardTitle>At-Risk Projects</CardTitle>
            <CardDescription>Projects requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.at_risk_projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects at risk</p>
            ) : (
              <div className="space-y-4">
                {dashboard.at_risk_projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.portfolio?.name}
                      </p>
                    </div>
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
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolios */}
        <Card>
          <CardHeader>
            <CardTitle>My Portfolios</CardTitle>
            <CardDescription>Active project portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.portfolios.slice(0, 5).map((portfolio) => (
                <Link
                  key={portfolio.id}
                  to={`/portfolios/${portfolio.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{portfolio.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.projects_count} projects
                    </p>
                  </div>
                  {portfolio.client_name && (
                    <Badge variant="outline">{portfolio.client_name}</Badge>
                  )}
                </Link>
              ))}
            </div>
            {dashboard.portfolios.length > 5 && (
              <Link
                to="/portfolios"
                className="block mt-4 text-sm text-primary hover:underline"
              >
                View all portfolios →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Upcoming project deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboard.timeline.map((item) => {
              const progress = item.days_total > 0 
                ? (item.days_elapsed / item.days_total) * 100 
                : 0;
              
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/projects/${item.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{format(new Date(item.start), 'MMM d')}</span>
                      <span>→</span>
                      <span>{format(new Date(item.end), 'MMM d')}</span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full ${
                        item.rag_status === 'red'
                          ? 'bg-red-500'
                          : item.rag_status === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}