import { ReactNode } from 'react';
import { Toaster } from './ui/toaster';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      {/* <AppSidebar />
      <SidebarInset> */}
      <div className="flex-1 overflow-auto">{children}</div>
      <Toaster />
      {/* </SidebarInset> */}
    </div>
  );
}
