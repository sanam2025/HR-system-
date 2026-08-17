import useAuthStore from "../../../../store/authStore";
import { useTasks } from "../../../../api/hooks/useTasks";

export default function EmployeeTasksFinance() {
  const userId = useAuthStore((state) => state.user?.id);
  const taskParams = userId ? { user_id: userId } : {};
  const taskQuery = useTasks(taskParams, { enabled: Boolean(userId) });
  const tasks = taskQuery.data?.items ?? [];
  const statusCounts = tasks.reduce(
    (acc, task) => {
      const status = task.status ?? "Unknown";
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">My Tasks</h1>
        <p className="text-sm text-gray-400 mt-1">Your current tasks are loaded from the authenticated task API.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          {taskQuery.isLoading && (
            <p className="text-sm text-gray-500">Loading tasks...</p>
          )}

          {taskQuery.isError && (
            <p className="text-sm text-red-500">Unable to load tasks. Please refresh or try again later.</p>
          )}

          {!taskQuery.isLoading && !tasks.length && !taskQuery.isError && (
            <p className="text-sm text-gray-500">No tasks assigned yet.</p>
          )}

          {tasks.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-500">Showing {tasks.length} task{tasks.length === 1 ? "" : "s"}.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
                  <div key={status} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{status}</p>
                    <p className="mt-2 text-2xl font-semibold text-dark">{count}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          {taskQuery.isLoading && <p className="text-sm text-gray-500">Retrieving task list…</p>}
          {taskQuery.isError && <p className="text-sm text-red-500">Unable to render tasks.</p>}

          {!taskQuery.isLoading && !taskQuery.isError && tasks.length > 0 && (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-gray-100 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-dark">{task.title}</p>
                      <p className="text-xs text-gray-400">Due {task.dueDate || "—"}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {task.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    {task.description ?? "No description available."}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
