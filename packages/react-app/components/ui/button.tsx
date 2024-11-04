import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type Props = {
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "font-bold bg-colors-secondary text-white shadow hover:bg-primary/90 rounded-2xl",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 rounded-2xl",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-white rounded-2xl",
        secondary:
          "font-bold bg-colors-secondary text-white shadow-sm hover:bg-secondary/80 rounded-2xl",
        ghost: "hover:bg-accent hover:text-white",
        link: " underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className,
    variant,
    size,
    asChild = false,
    title,
    onClick,
    widthFull = false,
    disabled,
    loading,
    ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        onClick={onClick}
        disabled={disabled ?? loading}
        className={cn(
          buttonVariants({ variant, size, className }),
          `${widthFull ? "w-full" : "px-4"}`
        )}
        ref={ref}
        {...props}
      >
        {loading ? <>Loading...</> : title}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
