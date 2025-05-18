'use client';

import type React from 'react';
import { forwardRef, useRef } from 'react';

import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/magicui/animated-beam';
import {
  MapPinnedIcon,
  DatabaseIcon,
  SatelliteIcon,
  TabletSmartphoneIcon,
  LaughIcon,
  UserIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:shadow-[0_0_20px_-12px_rgba(255,255,255,0.4)]',
        className
      )}>
      <div className='text-black dark:text-white'>{children}</div>
    </div>
  );
});

Circle.displayName = 'Circle';

export default function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10',
        className
      )}
      ref={containerRef}>
      <div className='flex size-full max-w-lg flex-row items-stretch justify-between gap-10'>
        <div className='flex flex-col justify-center'>
          <Circle ref={div7Ref}>
            <UserIcon />
          </Circle>
        </div>
        <div className='flex flex-col justify-center'>
          <Circle ref={div6Ref} className='size-16'>
            <VegaLogo />
          </Circle>
        </div>
        <div className='flex flex-col justify-center gap-2'>
          <Circle ref={div1Ref}>
            <MapPinnedIcon />
          </Circle>
          <Circle ref={div2Ref}>
            <DatabaseIcon />
          </Circle>
          <Circle ref={div3Ref}>
            <SatelliteIcon />
          </Circle>
          <Circle ref={div4Ref}>
            <TabletSmartphoneIcon />
          </Circle>
          <Circle ref={div5Ref}>
            <LaughIcon />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
    </div>
  );
}

// Keeping the OpenAI logo as requested
const VegaLogo = () => (
  <svg width='133.86' height='31.498' viewBox='0 0 133.86 31.498' fill='none'>
    <g clipPath='url(#clip0_1_577)'>
      <path
        d='M 0.193359,0.193385 H 9.44447 L 19.7511,21.3267 30.06,0.193385 h 34.7 V 6.80672 H 45.0756 v 5.66888 h 13.3867 v 5.9845 H 45.0756 v 6.1422 h 20.4733 v 7.0866 H 36.0978 V 6.78005 L 23.9489,31.6889 H 15.5534 Z M 134.051,31.6889 h -8.569 l -3.044,-7.0866 h -15.196 l -3.044,7.0866 H 67.5956 V 0.193385 H 96.5712 V 6.80672 h -20 V 24.6023 H 89.9578 V 18.4601 H 82.8712 V 12.4756 H 97.0445 V 28.3889 L 109.16,0.191162 h 11.362 L 134.053,31.6867 Z M 119.969,18.4601 114.838,6.51783 109.707,18.4601 Z'
        fill='#ffde00'
      />
    </g>
    <defs>
      <clipPath id='clip0_1_577'>
        <rect width='203.556' height='32' fill='#ffffff' x='0' y='0' />
      </clipPath>
    </defs>
  </svg>
);
