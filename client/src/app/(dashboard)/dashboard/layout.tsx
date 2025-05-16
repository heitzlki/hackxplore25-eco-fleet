import DockBar from '@/app/(dashboard)/dashboard/_components/dock-bar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DockBar />
      {children}
    </>
  );
}
