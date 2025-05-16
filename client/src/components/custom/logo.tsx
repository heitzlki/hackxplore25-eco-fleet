import Link from 'next/link';
import { cn } from '@/lib/utils'; // Ensure you have a utility for className merging
import { AuroraText } from '@/components/magicui/aurora-text';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string; // Added className prop for custom styles
};

export default function Logo({ size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-6xl',
    xl: 'text-8xl', // Added a new size for extra-large text
  };

  return (
    <Link
      href='/'
      className={cn(
        'flex items-center self-center font-bold',
        sizeClasses[size],
        className // Apply custom className if provided
      )}
    >
      <span className='text-primary'>Prizm</span>
      <AuroraText>AI</AuroraText>
    </Link>
  );
}