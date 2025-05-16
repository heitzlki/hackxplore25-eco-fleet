'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '@/app/(dashboard)/dashboard/_components/chat-window';

import { useStore } from '@/lib/store';

import Scene from '@/components/3d/scene';

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
      <Scene />
      <ChatWindow />
    </div>
  );
}
