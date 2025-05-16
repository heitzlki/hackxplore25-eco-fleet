'use client';

import { Hero } from '@/app/(marketing)/sections/hero';
import { About } from '@/app/(marketing)/sections/about';
import { Features } from '@/app/(marketing)/sections/features';
import { FAQ } from '@/app/(marketing)/sections/faq';
import { Footer } from '@/app/(marketing)/sections/footer';
import { Navbar } from '@/app/(marketing)/sections/navbar';

import { ScrollProgress } from '@/components/magicui/scroll-progress';
import { ResponsiveModeIndicator } from '@/components/ResponsiveModeIndicator';

export default function Home() {
  return (
    <>
      <Navbar />
      {/* <ResponsiveModeIndicator /> */}
      <main className='flex flex-col min-h-screen'>
        <section id='hero'>
          <Hero />
        </section>
        <section id='about'>
          <About />
        </section>
        <section id='features'>
          <Features />
        </section>
        <section id='faq'>
          <FAQ />
        </section>
        <Footer />
      </main>
    </>
  );
}
