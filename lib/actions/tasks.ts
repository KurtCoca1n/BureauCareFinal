"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { createClient } from "@/lib/supabase/server";

export async function markTaskDoneAction(formData: FormData) {
  const taskId = String(formData.get("taskId") ?? "").trim();

  if (!taskId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id, document_id")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!task) {
    return;
  }

  await supabase.from("tasks").update({ status: "done" }).eq("id", taskId).eq("user_id", user.id);

  if (task.document_id) {
    const { data: document } = await supabase
      .from("documents")
      .select("id, case_id")
      .eq("id", task.document_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (document) {
      await supabase.from("documents").update({ status: "erledigt" }).eq("id", document.id);

      if (document.case_id) {
        await createCaseEvent({
          caseId: document.case_id,
          documentId: document.id,
          eventType: "task_completed",
          note: "Aufgabe als erledigt markiert."
        });

        const { data: remainingOpenTasks } = await supabase
          .from("tasks")
          .select("id")
          .eq("user_id", user.id)
          .neq("status", "done")
          .eq("document_id", document.id);

        if (!remainingOpenTasks?.length) {
          await supabase.from("cases").update({ status: "done", updated_at: new Date().toISOString() }).eq("id", document.case_id);
          await createCaseEvent({
            caseId: document.case_id,
            documentId: document.id,
            eventType: "case_closed",
            note: "Fall automatisch als erledigt markiert."
          });
        }
      }
    }
  }

  revalidatePath("/app");
  revalidatePath("/app/tasks");
  revalidatePath("/app/cases");
}
