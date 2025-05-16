'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '@/app/(dashboard)/dashboard/_components/chat-window';

import data from './data.json';

import { useStore } from '@/lib/store';

import { SectionCards } from '@/app/(dashboard)/dashboard/_components/section-cards';
import { DataTable } from '@/app/(dashboard)/dashboard/_components/data-table';
import { ChartAreaInteractive } from '@/app/(dashboard)/dashboard/_components/chart-area-interactive';
import FileUpload from '@/app/(dashboard)/dashboard/_components/file-upload';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(true);
  const { setGraphData } = useStore();

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem('startData');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setGraphData(parsedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Get the graphData from the store to pass to Graph and ChatWindow
  const { graphData } = useStore();

  if (isLoading) {
    return (
      <div className=' flex items-center justify-center min-h-screen'>
        <div className='text-lg font-medium'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='relative top-20 flex flex-1 flex-col '>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6 mb-4'>
            <FileUpload />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
