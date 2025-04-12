import { ReactNode } from 'react';
import { Toaster } from './ui/toaster';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full">
      <div className="flex-1">{children}</div>
      <Toaster />
    </div>
  );
}
