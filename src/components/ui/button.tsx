import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition",
        "disabled:pointer-events-none disabled:opacity-60",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-[15px]",
        size === "lg" && "h-12 px-5 text-base",
        variant === "primary" &&
          "border-transparent bg-primary text-background hover:brightness-110 active:brightness-95",
        variant === "secondary" &&
          "border-transparent bg-primary-2 text-background hover:brightness-110 active:brightness-95",
        variant === "ghost" &&
          "border-border bg-transparent text-text hover:bg-surface-2 active:brightness-95",
        variant === "danger" &&
          "border-transparent bg-danger text-background hover:brightness-110 active:brightness-95",
        className,
      )}
      {...props}
    />
  );
}
