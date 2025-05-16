import Logo from '@/components/custom/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Cookies() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Logo />
      </div>
      <div className='container max-w-3xl py-10'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Cookies</CardTitle>
          </CardHeader>
          <CardContent className='prose dark:prose-invert'>
            <p className='font-bold'>ToDo</p>
            <p>...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
