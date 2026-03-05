import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-[15px] text-text placeholder:text-muted",
        "transition-colors duration-200",
        "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
