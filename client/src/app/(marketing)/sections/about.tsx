'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/magicui/text-reveal'; // Reintroduce TextReveal
import Logo from '@/components/custom/logo'; // Import the Logo component

export function About() {
  return (
    <section className='bg-background py-24'>
      <div className='container mx-auto px-4 lg:px-8'>
        <motion.div
          className='mx-auto max-w-3xl text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>
          <h2 className='mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
            About{' '}
            <span className='inline-block ml-2'>
              <Logo size='lg' className='text-4xl md:text-5xl' /> {/* Adjusted size to match "About" */}
            </span>
          </h2>
          <div className='h-1 w-20 mx-auto bg-primary mb-8'></div>
          <TextReveal className='text-xl leading-relaxed text-muted-foreground'>
            PrizmAI uses AI to extract and analyze data from PDFs.
          </TextReveal>
          <TextReveal className='text-xl leading-relaxed text-muted-foreground'>
            Reduce manual labour. Minimize errors. Save time.
          </TextReveal>
          <TextReveal className='text-xl leading-relaxed text-muted-foreground'>
            Integrate seamlessly. Faster decisions. Value from data.
          </TextReveal>
        </motion.div>
      </div>
    </section>
  );
}
