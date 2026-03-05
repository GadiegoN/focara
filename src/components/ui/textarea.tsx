import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-[15px] text-text placeholder:text-muted",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
