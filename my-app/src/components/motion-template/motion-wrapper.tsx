import { ReactNode } from "react";
import { motion, TargetAndTransition } from "framer-motion";
export interface motionWrapperProps {
  children: ReactNode;
  whileHover: TargetAndTransition;
  whileTap: TargetAndTransition;
  ismotionActivated: boolean;
}

export default function MotionWrapper({
  children,
  whileHover,
  whileTap,
  ismotionActivated,
}: motionWrapperProps) {
  return (
    <div>
      {ismotionActivated ? (
        <motion.div whileHover={whileHover} whileTap={whileTap}>
          {children}
        </motion.div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
