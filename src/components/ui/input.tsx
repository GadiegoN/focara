import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "focus-ring h-11 w-full rounded-lg border border-border bg-surface px-3 text-[15px] text-text placeholder:text-muted",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
