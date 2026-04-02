import { TaskCard } from "@/components/app/task-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCopy, getReminderCopy } from "@/lib/i18n";
import { getProfile, getTaskReminderBuckets } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

function TaskSection({
  title,
  tasks,
  locale,
  emptyText
}: {
  title: string;
  tasks: Awaited<ReturnType<typeof getTaskReminderBuckets>>["open"];
  locale: string;
  emptyText: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <StatusBadge tone={tasks.length ? "accent" : "neutral"}>{tasks.length}</StatusBadge>
      </div>
      {tasks.length ? (
        <div className="grid gap-4 2xl:auto-rows-fr 2xl:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} locale={locale} />
          ))}
        </div>
      ) : (
        <Card className="p-5 text-sm text-[var(--muted)]">{emptyText}</Card>
      )}
    </section>
  );
}

export default async function TasksPage() {
  const [profile, reminderBuckets] = await Promise.all([getProfile(), getTaskReminderBuckets()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getCopy(locale);
  const reminderCopy = getReminderCopy(locale);

  return (
    <div className="space-y-6">
      <section className="space-y-2 pt-3">
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{copy.tasks.title}</h1>
      </section>

      <TaskSection title={reminderCopy.overdue} tasks={reminderBuckets.overdue} locale={locale} emptyText={reminderCopy.noItems} />
      <TaskSection title={reminderCopy.dueToday} tasks={reminderBuckets.today} locale={locale} emptyText={reminderCopy.noItems} />
      <TaskSection title={reminderCopy.dueSoon} tasks={reminderBuckets.soon} locale={locale} emptyText={reminderCopy.noItems} />
      <TaskSection title={reminderCopy.openLater} tasks={reminderBuckets.open} locale={locale} emptyText={copy.tasks.none} />
      <TaskSection title={reminderCopy.completed} tasks={reminderBuckets.done} locale={locale} emptyText={reminderCopy.noItems} />
    </div>
  );
}
