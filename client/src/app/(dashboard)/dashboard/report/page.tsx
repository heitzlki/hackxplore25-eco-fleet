'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '@/app/(dashboard)/dashboard/_components/chat-window';

import { useStore } from '@/lib/store';

import { SectionCards } from '@/app/(dashboard)/dashboard/_components/section-cards';
import { DataTable } from '@/app/(dashboard)/dashboard/_components/data-table';
import { ChartAreaInteractive } from '@/app/(dashboard)/dashboard/_components/chart-area-interactive';

export default function Chat() {
  return (
    <div className='relative flex flex-1 flex-col top-20'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
          <div className='px-4 lg:px-6'>
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
