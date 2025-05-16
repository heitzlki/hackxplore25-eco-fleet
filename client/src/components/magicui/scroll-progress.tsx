'use client';

import { cn } from '@/lib/utils';
import { motion, MotionProps, useScroll } from 'motion/react';
import React from 'react';
type ScrollProgressProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
>;

export const ScrollProgress = React.forwardRef<
  HTMLDivElement,
  ScrollProgressProps
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        'absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-primary to-secondary',
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = 'ScrollProgress';
