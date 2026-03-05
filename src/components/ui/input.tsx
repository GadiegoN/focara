import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-border bg-surface px-3 text-[15px] text-text placeholder:text-muted",
        "transition-colors duration-200",
        "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
