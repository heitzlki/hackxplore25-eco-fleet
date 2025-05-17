'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagicCard } from '@/components/magicui/magic-card';
import { useTheme } from 'next-themes';
import Logo from '@/components/custom/logo';

export default function Signup() {
  const { theme } = useTheme();
  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Logo />
        <Card className='p-0 max-w-sm w-full shadow-none border-none'>
          <MagicCard
            gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
            className='p-0'>
            <CardHeader className='border-b border-border p-4 [.border-b]:pb-4'>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <form>
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input id='password' type='password' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='password'>Confirm Password</Label>
                    <Input id='password' type='password' />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className='p-4 border-t border-border [.border-t]:pt-4'>
              <Button className='w-full'>Sign Up</Button>
            </CardFooter>
          </MagicCard>
        </Card>
      </div>
    </div>
  );
}
