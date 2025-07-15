import { cn } from "@/lib/utils"
import React from "react"
import { cva } from "class-variance-authority"

const radioCardVariants = cva(
  "relative flex cursor-pointer select-none items-center rounded-lg border p-4 transition-all hover:bg-accent/50",
  {
    variants: {
      checked: {
        true: "border-primary bg-primary/5 ring-1 ring-primary/20",
        false: "border-input hover:border-primary/50",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  }
)

const indicatorVariants = cva(
  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
  {
    variants: {
      checked: {
        true: "border-primary bg-primary",
        false: "border-input bg-background",
      },
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  }
)

interface RadioCardProps {
  icon?: React.ReactNode
  label: string
  description?: string
  value: string
  checked: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const RadioCard = React.forwardRef<
  HTMLDivElement,
  RadioCardProps
>(({ icon, label, description, value, checked, disabled, onCheckedChange, ...props }, ref) => {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === " " || event.key === "Enter") && !disabled) {
      event.preventDefault()
      if (onCheckedChange) {
        onCheckedChange(!checked)
      }
    }
  }

  return (
    <div
      ref={ref}
      className={cn(radioCardVariants({ checked, disabled }))}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      {...props}
    >
      <div className="flex w-full items-start space-x-3">
        <div className="flex items-center">
          {icon && <div className="mr-2 flex h-5 w-5 items-center justify-center">{icon}</div>}
          <div
            className={cn(indicatorVariants({ checked, disabled }))}
            aria-hidden="true"
          >
            {checked && (
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            )}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-sm font-medium leading-none">{label}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
})
RadioCard.displayName = "RadioCard"
