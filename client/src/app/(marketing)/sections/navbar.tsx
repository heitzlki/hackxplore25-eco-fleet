'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { ScrollProgress } from '@/components/magicui/scroll-progress';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set mounted to true when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/60 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
      suppressHydrationWarning>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0 relative'>
            {/* <Logo /> */}
            <Link href='/'>
              {mounted ? (
                <img
                  src={theme === 'dark' ? '/PrizmAi_w.png' : '/PrizmAi_b.png'}
                  alt='Logo'
                  className='h-6 w-auto'
                />
              ) : (
                <div className='h-6 w-24' /> // Placeholder with same dimensions to prevent layout shift
              )}
            </Link>
          </div>

          {/* Navigation Links - Desktop - Now centered */}
          <div className='hidden md:flex flex-1 justify-center'>
            <div className='flex items-baseline space-x-4'>
              <Link
                href='#hero'
                className='px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100'>
                Home
              </Link>
              <Link
                href='#about'
                className='px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100'>
                About
              </Link>
              <Link
                href='#features'
                className='px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100'>
                Features
              </Link>
              <Link
                href='#faq'
                className='px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100'>
                FAQ
              </Link>
            </div>
          </div>

          {/* Login/Signup Buttons */}
          <div className='hidden md:flex items-center space-x-3 flex-shrink-0 relative'>
            <ModeToggle />
            <Button>
              <Link href='/dashboard' className='text-sm font-medium'>
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button className='p-2 '>
              <svg
                className='h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Scroll progress positioned at the bottom of the navbar */}
      <div className='absolute bottom-0 left-0 right-0 w-full'>
        <ScrollProgress />
      </div>
    </nav>
  );
};
