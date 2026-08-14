'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useViewStore, type ViewState } from '@/lib/store/ui';

const NAV_GROUPS: { label: string; items: { href: string; label: string; code: string }[] }[] = [
  {
    label: 'Holdings',
    items: [
      { href: '/', label: 'Portfolio', code: '01' },
      { href: '/assets/gold', label: 'Assets', code: '02' },
      { href: '/activity', label: 'Activity', code: '03' },
    ],
  },
  {
    label: 'Transact',
    items: [
      { href: '/buy', label: 'Buy metal', code: '04' },
      { href: '/redeem', label: 'Redeem', code: '05' },
    ],
  },
  {
    label: 'Assurance',
    items: [
      { href: '/reserve', label: 'Proof of reserve', code: '06' },
      { href: '/obligations', label: 'Obligations', code: '07' },
    ],
  },
  {
    label: 'Account',
    items: [{ href: '/settings', label: 'Settings', code: '08' }],
  },
];

const VIEW_OPTIONS: { key: ViewState; label: string }[] = [
  { key: 'live', label: 'Live' },
  { key: 'loading', label: 'Loading' },
  { key: 'empty', label: 'Empty' },
  { key: 'error', label: 'Error' },
  { key: 'gated', label: 'Gated' },
  { key: 'pending', label: 'Pending' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { view, setView } = useViewStore();

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] flex-none flex-col border-r border-apax-border">
      <div className="border-b border-apax-border px-[22px] pb-5 pt-6">
        <div className="flex items-baseline gap-2">
          <div className="font-serif text-[22px] font-semibold tracking-[.18em] text-apax-text">
            APAX
          </div>
          <div className="mb-1 h-[5px] w-[5px] bg-apax-gold" />
        </div>
        <div className="mt-2 font-mono text-[9.5px] uppercase leading-[1.8] tracking-[.16em] text-apax-dim2">
          Allocated metal
          <br />
          custody protocol
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-[18px]">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-[22px] pb-2 font-mono text-[9px] uppercase tracking-[.2em] text-apax-dim2">
              {group.label}
            </div>
            <div className="flex flex-col">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 border-l-2 px-[22px] py-2.5 text-[13px] text-apax-text2 hover:bg-apax-panel"
                    style={{
                      borderColor: active ? '#C8A253' : 'transparent',
                      background: active ? '#15181C' : 'transparent',
                    }}
                  >
                    <span className="font-mono text-[10px] text-apax-dim2">{item.code}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-apax-border px-[22px] py-4">
        <div className="flex items-center gap-1.5">
          <div className="h-[5px] w-[5px] rounded-full bg-apax-green" />
          <div className="font-mono text-[9px] uppercase tracking-[.18em] text-apax-muted">
            Reserves attested
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <div className="font-serif text-[27px] font-medium tabular-nums text-apax-text">
            100.14
          </div>
          <div className="text-[12px] text-apax-gold">%</div>
        </div>
        <div className="mt-1 font-mono text-[9.5px] text-apax-dim">
          backed · Kellerman &amp; Roth AG · 2d ago
        </div>
      </div>

      <div className="border-t border-apax-border px-[22px] py-4">
        <div className="font-mono text-[9px] uppercase tracking-[.2em] text-apax-dim2">
          State preview
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setView(opt.key)}
              className="border px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-[.1em] hover:text-apax-text"
              style={{
                color: view === opt.key ? '#C8A253' : '#5F666E',
                borderColor: view === opt.key ? '#4A3C22' : '#2E343A',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
