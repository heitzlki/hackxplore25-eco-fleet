import DockBar from '@/app/user/_components/dock-bar';

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
