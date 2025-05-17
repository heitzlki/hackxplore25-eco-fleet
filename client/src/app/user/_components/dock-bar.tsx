'use client';

import { useStore } from '@/lib/store';

import {
  BrainCircuitIcon,
  ChartNetwork,
  ChartNetworkIcon,
  FileChartColumnIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MapPlusIcon,
  PencilIcon,
  SparklesIcon,
  UserIcon,
  UserRoundCogIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { Button } from '@/components/ui/button';

export type IconProps = React.HTMLAttributes<SVGElement>;

const DATA = {
  navbar: [
    { href: '/user', icon: LayoutDashboardIcon, label: 'Home' },
    { href: '/user/graph', icon: SparklesIcon, label: 'AI' },
    // { href: '/user/3d', icon: BrainCircuitIcon, label: 'Magic' },
    // { href: '/user/pdf', icon: FileChartColumnIcon, label: 'PDF' },
    { href: '/user/report', icon: ChartNetworkIcon, label: 'Report' },
    // { href: '/user/settings', icon: UserRoundCogIcon, label: 'Settings' },
  ],
};

export default function DockBar() {
  const { roadmap, setRoadmap } = useStore();
  console.log(roadmap);

  return (
    <div className='fixed w-full top-0 z-50 px-4 py-5'>
      <div className='flex flex-col items-center justify-center'>
        <TooltipProvider>
          <Dock direction='middle' className='mt-0 bg-card'>
            {DATA.navbar.map((item) => (
              <DockIcon key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                        'size-12 rounded-full'
                      )}>
                      <item.icon className='size-4' />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
            {/* <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={setRoadmap}>
                    <MapPlusIcon className='size-4' />
                    <span className='sr-only'>Roadmap</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Roadmap</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon> */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ModeToggle />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </TooltipProvider>
      </div>
    </div>
  );
}
