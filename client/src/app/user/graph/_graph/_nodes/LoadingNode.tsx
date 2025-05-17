'use client';

import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingNode({
  data,
}: {
  data: {
    color: string;
    title: string;
    info: string;
    delay?: number;
    onLoadComplete?: () => void;
  };
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data.delay) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (data.onLoadComplete) {
          data.onLoadComplete();
        }
      }, data.delay);

      return () => clearTimeout(timer);
    }
  }, [data.delay, data.onLoadComplete]);

  return (
    <div
      className='px-4 py-2 bg-card text-card-foreground flex flex-col gap-6 rounded-xl shadow-sm max-w-[280px] w-max border border-muted border-opacity-10'
      style={{ borderColor: data.color }}>
      <div className='flex flex-col'>
        {isLoading ? (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-6 w-[150px] rounded-md' />
              <div
                className='w-8 h-8 border-3 border-t-transparent rounded-full animate-spin'
                style={{
                  borderColor: data.color,
                  borderTopColor: 'transparent',
                }}
              />
            </div>
            <Skeleton className='h-4 w-[200px] rounded-md' />
            <Skeleton className='h-4 w-[180px] rounded-md' />
            <div className='flex items-center mt-3'>
              <span className='text-sm text-muted-foreground'>
                Processing...
              </span>
            </div>
          </div>
        ) : (
          <div className='ml-2 break-all'>
            <div className='text-lg font-bold break-words'>{data.title}</div>
            <div className='dark:text-gray-400'>{data.info}</div>
          </div>
        )}
      </div>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
}

export default memo(LoadingNode);
