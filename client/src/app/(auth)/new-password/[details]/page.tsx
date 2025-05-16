'use client';

import { useParams } from 'next/navigation';
import Logo from '@/components/custom/logo';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const params = useParams();
  // const resetToken = params.details;

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Logo />
        <div className={'flex flex-col gap-6'}>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle className='text-xl'>Set New Password</CardTitle>
              <CardDescription>
                Please create a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className='grid gap-6'>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='password'>New Password</Label>
                      <Input id='password' type='password' required />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='confirmPassword'>Confirm Password</Label>
                      <Input id='confirmPassword' type='password' required />
                    </div>
                    <Button type='submit' className='w-full'>
                      Update Password
                    </Button>
                  </div>
                  <div className='text-center text-sm'>
                    Remember your password?{' '}
                    <a href='/login' className='underline underline-offset-4'>
                      Back to login
                    </a>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
