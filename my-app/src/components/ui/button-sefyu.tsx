"use client";

import * as React from "react";
import { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { CreateTypes } from "canvas-confetti";
import confetti from "canvas-confetti";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  enableConfetti = true,
  onConfettiComplete,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    enableConfetti?: boolean;
    onConfettiComplete?: () => void;
  }) {
  const Comp = asChild ? Slot : "button";
  const buttonRef = React.useRef<HTMLElement | null>(null);

  const createConfetti = () => {
    if (!enableConfetti || props.disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const { innerWidth, innerHeight } = window;
    const rect = button.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / innerWidth;
    const originY = (rect.top + rect.height / 2) / innerHeight;

    const options: CreateTypes = {
      origin: { x: originX, y: originY },
      scalar: 0.9,
      ticks: 500,
      gravity: 1.1,
      startVelocity: 45,
      colors: ["#22c55e", "#0ea5e9", "#f97316", "#facc15"],
    } as const;

    confetti({
      ...options,
      particleCount: 60,
      spread: 70,
    });

    confetti({
      ...options,
      particleCount: 40,
      spread: 120,
      decay: 0.92,
      scalar: 0.8,
    });

    confetti({
      ...options,
      particleCount: 25,
      spread: 100,
      scalar: 1.1,
      startVelocity: 35,
      decay: 0.88,
    });

    window.setTimeout(() => {
      onConfettiComplete?.();
    }, 800);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createConfetti();
    props.onClick?.(e);
  };

  return (
    <div className="relative inline-block">
      <Comp
        ref={buttonRef}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        onClick={handleClick}
      />
    </div>
  );
}

// Demo component to show the button in action
export default function ConfettiButtonDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Confetti Button Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Click any button to see the confetti effect!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Clicks: {clickCount}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => setClickCount((c) => c + 1)}>
          Default Button 🎉
        </Button>

        <Button variant="secondary" onClick={() => setClickCount((c) => c + 1)}>
          Secondary Style
        </Button>

        <Button variant="outline" onClick={() => setClickCount((c) => c + 1)}>
          Outline Style
        </Button>

        <Button
          variant="destructive"
          onClick={() => setClickCount((c) => c + 1)}
        >
          Destructive
        </Button>

        <Button size="lg" onClick={() => setClickCount((c) => c + 1)}>
          Large Button
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setClickCount((c) => c + 1)}
        >
          Small Ghost
        </Button>

        <Button
          enableConfetti={false}
          onClick={() => setClickCount((c) => c + 1)}
        >
          No Confetti (disabled)
        </Button>

        <Button disabled>Disabled Button</Button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md text-sm">
        <p className="font-semibold mb-2">New Props:</p>
        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
          <li>
            • <code>enableConfetti</code> - Enable/disable the effect (default:
            true)
          </li>
          <li>
            • <code>onConfettiComplete</code> - Callback when animation finishes
          </li>
        </ul>
      </div>
    </div>
  );
}

export { Button, buttonVariants };
