'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import Roadmap from '../_components/roadmap';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(true);
  const { setGraphData } = useStore();

  useEffect(() => {
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

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg font-medium'>Loading...</div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      <Roadmap />
    </div>
  );
}
