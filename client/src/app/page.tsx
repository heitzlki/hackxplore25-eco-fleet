'use client';

import { Hero } from '@/app/(marketing)/sections/hero';
import { About } from '@/app/(marketing)/sections/about';
import { Features } from '@/app/(marketing)/sections/features';
import { FAQ } from '@/app/(marketing)/sections/faq';
import { Footer } from '@/app/(marketing)/sections/footer';
import { Navbar } from '@/app/(marketing)/sections/navbar';
import { Bento } from '@/app/(marketing)/sections/bento';

import { ScrollProgress } from '@/components/magicui/scroll-progress';
import { ResponsiveModeIndicator } from '@/components/ResponsiveModeIndicator';

export default function Home() {
  return (
    <>
      <Navbar />
      {/* <ResponsiveModeIndicator /> */}
      <main className='flex flex-col min-h-screen'>
        <Hero />
        <Bento />
        {/* <About /> */}
        {/* <Features /> */}
        {/* <FAQ /> */}
        <Footer />
      </main>
    </>
  );
}
