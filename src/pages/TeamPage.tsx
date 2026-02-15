import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertTriangle, User } from 'lucide-react';
import { TeamWorkloadMember } from '@/types';

export function TeamPage() {
  const { data: team, isLoading } = useQuery({
    queryKey: ['team-workload'],
    queryFn: api.getTeamWorkload,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground">
            Manage team members and view workload
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Team Workload */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team?.team?.map((member: TeamWorkloadMember) => (
          <Card key={member.id} className={member.at_risk ? 'border-red-200' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                {member.at_risk && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold">{member.total_tasks}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${member.overdue_tasks > 0 ? 'text-red-600' : ''}`}>
                    {member.overdue_tasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${member.due_soon_tasks > 3 ? 'text-amber-600' : ''}`}>
                    {member.due_soon_tasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Due Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Users */}
      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>Full team directory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users?.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  {user.active_tasks !== undefined && (
                    <Badge>{user.active_tasks} active</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}