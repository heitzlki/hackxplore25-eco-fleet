'use client';

// import Globe from '@/components/custom/marketing/globe';
import { motion } from 'framer-motion';

import { TypingAnimation } from '@/components/magicui/typing-animation';
import { Button } from '@/components/ui/button';
import { BorderBeam } from '@/components/magicui/border-beam';
import { HyperText } from '@/components/magicui/hyper-text';
import Logo from '@/components/custom/logo';
import { Beam } from '../_components/beam';
import Globe from '@/app/(marketing)/_components/globe';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  return (
    <section className='relative flex min-h-screen items-center overflow-hidden bg-background py-20'>
      <div className='container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-2 lg:px-8'>
        <motion.div
          className='flex flex-col justify-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <h1 className='mb-4 text-5xl font-bold tracking-tight text-foreground md:text-7xl'>
            <Logo size='lg' />
          </h1>
          <span className='mt-4 text-xl md:text-2xl font-medium text-foreground'>
            <TypingAnimation>Efficient. Clean. Reliable.</TypingAnimation>
          </span>

          <Button
            className='mt-6 relative inline-block w-fit text-2xl font-medium text-white bg-black rounded-lg border px-8 py-4 h-auto hover:bg-gray-800'
            variant='ghost'
            onClick={() => {
              router.push('/user/');
            }}>
            Get started
            <BorderBeam
              duration={6}
              size={40}
              className='from-transparent via-custom-one to-transparent'
            />
            <BorderBeam
              duration={6}
              delay={3}
              size={40}
              className='from-transparent via-custom-three to-transparent'
            />
          </Button>
        </motion.div>

        <motion.div
          className='relative hidden md:flex items-center justify-center w-full h-full'
          style={{ height: '500px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}>
          {/* <Beam /> */}
          <Globe />
        </motion.div>
      </div>
    </section>
  );
}
