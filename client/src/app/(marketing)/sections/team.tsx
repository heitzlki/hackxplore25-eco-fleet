import { motion } from 'framer-motion';

import { LinkedinIcon } from 'lucide-react';
import { AuroraText } from '@/components/magicui/aurora-text';
import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  linkedinUrl: string;
  imageSrc: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  linkedinUrl,
  imageSrc,
}) => {
  return (
    <div className='flex flex-col items-center space-y-4 p-4 w-full'>
      <div className='flex flex-col items-center'>
        <div className='w-48 h-48 overflow-hidden rounded-full'>
          <Image
            src={imageSrc}
            alt={name}
            width={192}
            height={192}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
      <div className='text-center'>
        <h3 className='text-xl font-semibold'>{name}</h3>
        <div className='mt-2 space-y-1'>
          <a
            href={linkedinUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center text-custom-one hover:text-custom-two transition-colors'>
            <LinkedinIcon className='mr-2 w-5 h-5' />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export function Team() {
  const teamData = [
    {
      name: 'Rui Zhang',
      linkedinUrl: 'https://www.linkedin.com/in/rui-zhang-978822290/',
      imageSrc: '/rui.jpeg',
    },

    {
      name: 'Lukas Diebold',
      linkedinUrl: 'https://www.linkedin.com/in/lukas-diebold/',
      imageSrc: '/lukas.jpeg',
    },

    {
      name: 'Sebastian Truijens',
      linkedinUrl: 'https://www.linkedin.com/in/sebastian-truijens/',
      imageSrc: '/sebastian.jpeg',
    },
    {
      name: 'Oliver James Oberle',
      linkedinUrl: 'https://www.linkedin.com/in/oliver-james-oberle-2701b5329/',
      imageSrc: '/oliver.jpeg',
    },
    {
      name: 'Kirill Heitzler',
      linkedinUrl: 'https://www.linkedin.com/in/kirill-heitzler/',
      imageSrc: '/kirill.jpeg',
    },
  ];
  return (
    <section
      id={'team'}
      className='relative flex items-center justify-center px-4 overflow-hidden snap-start'>
      <motion.div
        className='container relative z-10 mx-auto px-4 py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}>
        <div className='max-w-4xl mx-auto'>
          <motion.div className='text-center mb-12'>
            <div className='inline-block mb-6'></div>
            <h2 className='text-4xl font-bold mb-4 dark:text-white text-gray-900'>
              About the <AuroraText>Team</AuroraText>
            </h2>
            <div className='flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto'>
              {teamData.map((member, index) => (
                <TeamMember
                  key={index}
                  name={member.name}
                  linkedinUrl={member.linkedinUrl}
                  imageSrc={member.imageSrc}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
