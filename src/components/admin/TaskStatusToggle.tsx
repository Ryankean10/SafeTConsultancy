"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setTaskStatus } from "@/lib/actions/tasks";
import type { TaskStatus } from "@/lib/types";

export default function TaskStatusToggle({
  taskId,
  status,
}: {
  taskId: string;
  status: TaskStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const done = status === "done";

  function toggle() {
    startTransition(async () => {
      await setTaskStatus(taskId, done ? "open" : "done");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={done ? "Mark task as open" : "Mark task as done"}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors disabled:opacity-50 ${
        done
          ? "border-green-600 bg-green-600 text-white"
          : "border-black/30 bg-white hover:border-navy"
      }`}
    >
      {done && (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
