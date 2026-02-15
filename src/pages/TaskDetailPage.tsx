import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = parseInt(id!);

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.getTask(taskId),
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

  if (!task) {
    return <div>Task not found</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Circle className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      blocked: 'Blocked',
      done: 'Done',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/projects/${task.project_id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {task.project?.name} / {task.nesting_level > 1 ? '... / ' : ''}
            {task.title}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(task.status)}
              <div>
                <CardTitle className="text-xl">{task.title}</CardTitle>
                <CardDescription>
                  Level {task.nesting_level} task
                </CardDescription>
              </div>
            </div>
            <Badge variant={task.status as any}>
              {getStatusBadge(task.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Assigned To</h3>
              <p className="text-muted-foreground">
                {task.assignee?.name || 'Unassigned'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Due Date</h3>
              <p className="text-muted-foreground">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : 'No due date'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Priority</h3>
              <Badge variant="outline">{task.priority}</Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Created By</h3>
              <p className="text-muted-foreground">{task.creator?.name}</p>
            </div>
          </div>

          {task.is_blocked && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">This task is blocked</span>
              </div>
            </div>
          )}

          {task.has_issue && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Issue reported</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subtasks */}
      {task.children && task.children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subtasks</CardTitle>
            <CardDescription>
              {task.children.length} subtask{task.children.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {task.children.map((subtask: any) => (
                <Link
                  key={subtask.id}
                  to={`/tasks/${subtask.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(subtask.status)}
                    <span>{subtask.title}</span>
                  </div>
                  <Badge variant={subtask.status as any}>
                    {getStatusBadge(subtask.status)}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}