'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatusBanner } from '@/components/layout/StatusBanner';
import { useAuthStore } from '@/lib/store/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-apax-bg text-apax-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-8 pb-[72px] pt-[34px]">
          <div className="mx-auto max-w-[1240px]">
            <StatusBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
