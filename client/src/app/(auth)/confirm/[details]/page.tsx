'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '@/components/custom/logo';
import { CheckCircle, Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function EmailConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const confirmationToken = params.details;
  const [confirmationStatus, setConfirmationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');

  // Here you would typically verify the token with your backend
  useEffect(() => {
    // Simulate API call to verify token
    setTimeout(() => {
      // For now, always assume success - in a real app this would check the token validity
      setConfirmationStatus('success');
    }, 1000);
  }, [confirmationToken]);

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Logo />
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle className='text-xl'>Email Confirmed</CardTitle>
              <CardDescription>
                {confirmationStatus === 'loading'
                  ? 'Verifying your email...'
                  : 'Your email has been successfully verified'}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center gap-6'>
              {confirmationStatus === 'loading' ? (
                <Loader2Icon className='h-16 w-16 animate-spin text-primary' />
              ) : (
                <CheckCircle className='h-16 w-16 text-primary' />
              )}

              <div className='grid gap-6 w-full'>
                <div className='text-center text-sm'>
                  {confirmationStatus === 'success' && (
                    <p>
                      Thank you for confirming your email address. You can now
                      log in to your account.
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => router.push('/login')}
                  disabled={confirmationStatus === 'loading'}
                  className='w-full'>
                  Proceed to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
