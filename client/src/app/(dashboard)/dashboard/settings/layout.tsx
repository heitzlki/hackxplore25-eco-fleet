import { Metadata } from 'next';
import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/app/(dashboard)/dashboard/settings/components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/dashboard/settings',
  },
  {
    title: 'Account',
    href: '/dashboard/settings/account',
  },
  {
    title: 'Appearance',
    href: '/dashboard/settings/appearance',
  },
  {
    title: 'Notifications',
    href: '/dashboard/settings/notifications',
  },
  {
    title: 'Display',
    href: '/dashboard/settings/display',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className='container-wrapper flex justify-center'>
      <div className='container py-6 w-full top-20 relative flex flex-1 flex-col'>
        <section className='overflow-hidden rounded-[0.5rem] border bg-background shadow'>
          <div className='md:hidden'>
            <Image
              src='/examples/forms-light.png'
              width={1280}
              height={791}
              alt='Forms'
              className='block dark:hidden'
            />
            <Image
              src='/examples/forms-dark.png'
              width={1280}
              height={791}
              alt='Forms'
              className='hidden dark:block'
            />
          </div>
          {/* <div className=''> */}
          <div className='hidden space-y-6 p-10 pb-16 md:block'>
            <div className='space-y-0.5'>
              <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
              <p className='text-muted-foreground'>
                Manage your account settings and set e-mail preferences.
              </p>
            </div>
            <Separator className='my-6' />
            <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <aside className='-mx-4 lg:w-1/5'>
                <SidebarNav items={sidebarNavItems} />
              </aside>
              <div className='flex-1 lg:max-w-2xl'>{children}</div>
              {/* </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
