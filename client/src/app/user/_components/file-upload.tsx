'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import mockData from './data.json';

// Flag to toggle between mock data and real API calls
const useMockData = true; // Set to false to make actual API calls

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const setServerResponse = useStore((state) => state.setServerResponse);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        setError('Please select a PDF file only');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use imported mock data
        // Small delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Using mock data:', mockData);
        setServerResponse(mockData);
        router.push('/dashboard/graph');
        return;
      }

      // Real API call (only executed if useMockData is false)
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'http://kheitzler.vsos.ethz.ch:4000/api/v1/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      // Store the server response in the Zustand store
      setServerResponse(data);

      // Redirect to analysis page after successful upload
      router.push('/dashboard/graph');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a File</CardTitle>
        <CardDescription>
          Select a PDF file to upload and click the submit button.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='flex items-center justify-center w-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <UploadIcon className='w-10 h-10 text-gray-400' />
                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  PDF files only
                </p>
              </div>
              <input
                id='dropzone-file'
                type='file'
                className='hidden'
                accept='.pdf,application/pdf'
                onChange={handleFileChange}
              />
            </label>
          </div>
          {error && (
            <div className='text-sm text-red-500 font-medium'>{error}</div>
          )}
          {file && (
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{file.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button type='submit' disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

interface UploadIconProps extends React.SVGProps<SVGSVGElement> {}

function UploadIcon(props: UploadIconProps) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='17 8 12 3 7 8' />
      <line x1='12' x2='12' y1='3' y2='15' />
    </svg>
  );
}
