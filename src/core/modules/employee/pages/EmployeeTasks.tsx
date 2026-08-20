import { useStartTask, useSubmitTask, useTasks } from "../../../../api/hooks/useTasks";
import { TaskListCard, TaskStatusSummaryCard } from "../components/speciel-components/TaskComponents";
import { ApiError } from "../../../../lib/http/ApiError";

export default function EmployeeTasks() {
  const taskQuery = useTasks({});
  const tasks = taskQuery.data?.items ?? [];

  const startTask = useStartTask();
  const submitTask = useSubmitTask();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">My Tasks - المهام</h1>
        <p className="text-sm text-gray-400 mt-1">Your current tasks are loaded from the authenticated task API.</p>
      </div>

      <div className="w-full flex flex-col gap-6">
        <TaskStatusSummaryCard tasks={tasks} />
        <TaskListCard
          tasks={tasks}
          isLoading={taskQuery.isLoading}
          isError={taskQuery.isError}
          onStart={(id) => startTask.mutate(id)}
          startingId={startTask.isPending ? (startTask.variables as number) : null}
          startError={(startTask.error as ApiError | null)?.message ?? null}
          onSubmit={(id, payload) => submitTask.mutate({ id, payload })}
          submittingId={submitTask.isPending ? (submitTask.variables as { id: number })?.id : null}
          submitError={(submitTask.error as ApiError | null)?.message ?? null}
        />
      </div>
    </div>
  );
}
