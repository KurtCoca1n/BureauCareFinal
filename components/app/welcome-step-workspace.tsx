import Link from "next/link";
import { ChevronRight, FileBadge2, Files, FolderOpen, Mail, Sparkles, SquareCheckBig } from "lucide-react";
import type { Route } from "next";

import { AnalyzeDocumentForm } from "@/components/app/analyze-document-form";
import {
  WelcomeCreateCaseButton,
  WelcomeCreateTaskButton,
  WelcomeLinkExistingDocumentForm,
  WelcomeStepDocumentUploadForm
} from "@/components/app/welcome-workspace-actions";
import { TaskCompleteForm } from "@/components/app/task-complete-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDocumentStatusLabel } from "@/lib/case-ui";
import { getDateLocale } from "@/lib/i18n";
import type { CaseRecord } from "@/lib/types";
import type { SupportedLanguage } from "@/lib/languages";
import type { WelcomeStepKey } from "@/lib/welcome";
import { getWelcomeWorkspaceCopy, type WelcomeWorkspaceData } from "@/lib/welcome-workspace-v2";

export function WelcomeStepWorkspace({
  locale,
  stepKey,
  workspace,
  linkedCase
}: {
  locale: SupportedLanguage;
  stepKey: WelcomeStepKey;
  workspace: WelcomeWorkspaceData;
  linkedCase: CaseRecord | null;
}) {
  const copy = getWelcomeWorkspaceCopy(locale);
  const dateLocale = getDateLocale(locale);
  const latestReplyDocument = workspace.documents.find((item) => item.analysis && item.replies.length > 0);
  const latestAnalyzedDocument = workspace.documents.find((item) => item.analysis);

  return (
    <div className="space-y-4">
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
            <Files className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.documentsTitle}</h2>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.documentsText}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="space-y-3">
            {workspace.documents.length ? (
              workspace.documents.map(({ document, analysis, replies }) => (
                <div key={document.id} className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="accent">{copy.linkedLabel}</StatusBadge>
                    <StatusBadge tone={analysis ? "success" : "neutral"}>
                      {getDocumentStatusLabel(document.status, locale)}
                    </StatusBadge>
                    {analysis?.deadline_date ? (
                      <StatusBadge tone="warning">
                        {copy.deadlineLabel} {new Date(analysis.deadline_date).toLocaleDateString(dateLocale)}
                      </StatusBadge>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">{document.original_filename}</h3>
                  {analysis?.summary_simple ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{analysis.summary_simple}</p> : null}
                  {!analysis ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.noReplyText}</p> : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/app/documents/${document.id}` as Route} className="inline-flex">
                      <Button variant="secondary">{copy.openDocumentLabel}</Button>
                    </Link>
                    {!analysis ? (
                      <AnalyzeDocumentForm documentId={document.id} submitLabel={copy.analyzeLabel} loadingLabel={copy.analyzingLabel} />
                    ) : null}
                    {analysis ? (
                      <Link href={`/app/documents/${document.id}/reply` as Route} className="inline-flex">
                        <Button>{copy.createReplyLabel}</Button>
                      </Link>
                    ) : null}
                  </div>
                  {replies.length ? (
                    <p className="mt-3 text-xs font-medium text-[var(--accent-strong)]">
                      {copy.latestReplyLabel}: {replies[0]?.created_at ? new Date(replies[0].created_at).toLocaleDateString(dateLocale) : ""}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
                <p className="font-semibold text-[var(--foreground)]">{copy.noDocumentsTitle}</p>
                <p className="mt-2">{copy.noDocumentsText}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <WelcomeStepDocumentUploadForm stepKey={stepKey} locale={locale} label={copy.uploadLabel} />
            <WelcomeLinkExistingDocumentForm
              stepKey={stepKey}
              locale={locale}
              documents={workspace.recentDocuments}
              label={copy.linkExistingLabel}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.replyTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.replyText}</p>
            </div>
          </div>

          {latestAnalyzedDocument ? (
            <div className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">{latestAnalyzedDocument.document.original_filename}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.replyContextHint}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/app/documents/${latestAnalyzedDocument.document.id}/reply` as Route} className="inline-flex">
                  <Button>{copy.createReplyLabel}</Button>
                </Link>
                {latestReplyDocument ? (
                  <Link href={`/app/documents/${latestReplyDocument.document.id}/reply` as Route} className="inline-flex">
                    <Button variant="secondary">{copy.latestReplyLabel}</Button>
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
              {copy.noReplyText}
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.caseTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.caseText}</p>
            </div>
          </div>

          {linkedCase ? (
            <div className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">{linkedCase.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{linkedCase.organization ?? ""}</p>
              <div className="mt-4">
                <Link href={`/app/cases/${linkedCase.id}` as Route} className="inline-flex">
                  <Button variant="secondary">
                    {copy.openCaseLabel}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
                {copy.caseText}
              </div>
              <WelcomeCreateCaseButton stepKey={stepKey} locale={locale} label={copy.createCaseLabel} />
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
              <SquareCheckBig className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.taskTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.taskText}</p>
            </div>
          </div>

          {workspace.tasks.length ? (
            <div className="space-y-3">
              {workspace.tasks.map((task) => (
                <div key={task.id} className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={task.status === "done" ? "success" : "accent"}>
                      {task.status === "done" ? copy.taskDoneLabel : copy.nextStepMeaning}
                    </StatusBadge>
                    {task.due_date ? (
                      <StatusBadge tone="warning">
                        {copy.deadlineLabel} {new Date(task.due_date).toLocaleDateString(dateLocale)}
                      </StatusBadge>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                  {task.action_summary ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{task.action_summary}</p> : null}
                  {task.status !== "done" ? (
                    <div className="mt-4">
                      <TaskCompleteForm taskId={task.id} doneLabel={copy.markTaskDoneLabel} savingLabel={copy.savingTaskLabel} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
                {copy.noTasksText}
              </div>
              <WelcomeCreateTaskButton stepKey={stepKey} locale={locale} label={copy.createTaskLabel} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
