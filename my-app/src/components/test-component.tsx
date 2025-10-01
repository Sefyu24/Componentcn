import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export type variant =
  | "default"
  | "link"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";

interface TestComponentProps {
  variant: variant;
  borderRadius?: string;
  bgColor?: string;
  textSize?: string;
  fontWeight?: string;
}

export default function TestComponent({
  variant,
  borderRadius = "md",
  bgColor,
  textSize = "sm",
  fontWeight = "medium",
}: TestComponentProps) {
  // Map the values to Tailwind classes
  const borderRadiusClass = `rounded-${borderRadius}`;
  const bgColorClass = bgColor ? `bg-${bgColor}` : "";
  const textSizeClass = `text-${textSize}`;
  const fontWeightClass = `font-${fontWeight}`;

  return (
    <Button
      variant={variant}
      className={cn(
        borderRadiusClass,
        bgColorClass,
        textSizeClass,
        fontWeightClass
      )}
    >
      Hello
    </Button>
  );
}
