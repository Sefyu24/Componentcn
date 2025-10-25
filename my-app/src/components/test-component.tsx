import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import MotionWrapper from "./motion-template/motion-wrapper";
import { motionWrapperProps } from "./motion-template/motion-wrapper";

export type variant =
  | "default"
  | "link"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";

interface TestComponentProps extends Omit<motionWrapperProps, "children"> {
  variant: variant;
  borderRadius?: string;
  bgColor?: string;
  textSize?: string;
  fontWeight?: string;
}

export default function TestComponent({
  variant,
  borderRadius = "md",
  textSize = "sm",
  fontWeight = "medium",
  whileHover,
  whileTap,
  ismotionActivated,
}: TestComponentProps) {
  // Map the values to Tailwind classes
  const borderRadiusClass = `rounded-${borderRadius}`;
  const textSizeClass = `text-${textSize}`;
  const fontWeightClass = `font-${fontWeight}`;

  return (
    <MotionWrapper
      whileHover={whileHover}
      whileTap={whileTap}
      ismotionActivated={ismotionActivated}
    >
      <Button
        variant={variant}
        className={cn(borderRadiusClass, textSizeClass, fontWeightClass)}
      >
        Hello
      </Button>
    </MotionWrapper>
  );
}
