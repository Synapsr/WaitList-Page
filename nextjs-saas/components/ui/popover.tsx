"use client"

import * as React from "react"

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

function usePopoverContext() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover components must be used within a Popover provider")
  }
  return context
}

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Popover({ open: controlledOpen, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps {
  asChild?: boolean
  className?: string
  children: React.ReactNode
}

function PopoverTrigger({ asChild, className = "", children }: PopoverTriggerProps) {
  const { open, onOpenChange } = usePopoverContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => onOpenChange(!open),
    })
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenChange(!open)}
    >
      {children}
    </button>
  )
}

interface PopoverContentProps {
  className?: string
  children: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
}

function PopoverContent({ 
  className = "", 
  children, 
  align = "center",
  sideOffset = 4 
}: PopoverContentProps) {
  const { open, onOpenChange } = usePopoverContext()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        // Check if the click was on the trigger
        const trigger = contentRef.current.parentElement?.querySelector('[data-popover-trigger]')
        if (trigger && trigger.contains(event.target as Node)) {
          return
        }
        onOpenChange(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onOpenChange])

  if (!open) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 ${alignmentClasses[align]} rounded-md border bg-background p-4 text-foreground shadow-md outline-none ${className}`}
      style={{ marginTop: sideOffset }}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
