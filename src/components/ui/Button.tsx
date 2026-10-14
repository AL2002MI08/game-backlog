import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "danger-solid" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export const BUTTON_VARIANT_STYLES: Record<ButtonVariant, string> = {
    primary:
        "bg-teal-500 hover:bg-teal-400 active:bg-teal-500 text-slate-950 border border-transparent shadow-sm shadow-teal-500/20",
    secondary:
        "bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30",
    outline:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
    danger:
        "bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30",
    "danger-solid":
        "bg-rose-500 hover:bg-rose-400 active:bg-rose-500 text-white border border-transparent shadow-sm shadow-rose-500/20",
    ghost:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-transparent",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-11 px-5 text-sm gap-2",
    icon: "h-8 w-8 p-0 gap-0",
};

const BASE_CLASSES = [
    "inline-flex items-center justify-center rounded-lg font-bold tracking-tight leading-none whitespace-nowrap",
    "transition-colors duration-150 cursor-pointer select-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070b14]",
].join(" ");

export function buttonClassName(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className = "") {
    return [BASE_CLASSES, BUTTON_VARIANT_STYLES[variant], SIZE_STYLES[size], className].join(" ");
}

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = "primary", size = "md", className = "", loading = false, disabled, type = "button", ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || loading}
                className={buttonClassName(variant, size, className)}
                {...props}
            >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export default Button;
