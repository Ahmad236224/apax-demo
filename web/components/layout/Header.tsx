'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { useViewStore } from '@/lib/store/ui';
import { METAL_REFERENCE } from '@/lib/metals';
import { usd, signedPct } from '@/lib/format';

export function Header() {
  const { user } = useAuthStore();
  const { view } = useViewStore();
  const gated = view === 'gated';

  const initials = (user?.fullName ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-apax-border bg-apax-bg">
      <div className="flex min-h-[46px] flex-wrap items-center justify-between gap-[18px] px-8 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-5">
          <div className="font-mono text-[9px] uppercase tracking-[.18em] text-apax-dim2">
            Spot · USD/ozt
          </div>
          {(Object.keys(METAL_REFERENCE) as (keyof typeof METAL_REFERENCE)[]).map((key) => {
            const m = METAL_REFERENCE[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5" style={{ background: m.color }} />
                <div className="font-mono text-[11px] uppercase tracking-[.1em] text-apax-muted">
                  {m.element}
                </div>
                <div className="text-[13px] tabular-nums text-apax-text">
                  {usd(m.spotUsdPerOz)}
                </div>
                <div
                  className="font-mono text-[10px]"
                  style={{ color: m.dailyChangePct >= 0 ? '#5E9C7B' : '#B4685E' }}
                >
                  {signedPct(m.dailyChangePct)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-none items-center gap-[18px]">
          <div
            className="flex items-center gap-1.5 border px-2 py-[3px]"
            style={{ borderColor: gated ? '#4A3C22' : '#2E343A' }}
          >
            <div
              className="h-[5px] w-[5px] rounded-full"
              style={{ background: gated ? '#C8A253' : '#5E9C7B' }}
            />
            <div className="font-mono text-[9px] uppercase tracking-[.14em] text-apax-text2">
              {gated ? 'KYC pending' : 'KYC approved'}
            </div>
          </div>
          {user?.walletAddress ? (
            <div className="font-mono text-[10px] text-apax-dim">
              {user.walletAddress.slice(0, 6)}…{user.walletAddress.slice(-4)}
            </div>
          ) : null}
          <Link href="/settings" className="flex items-center gap-2.5 hover:opacity-75">
            <div className="grid h-6 w-6 place-items-center border border-apax-border2 font-mono text-[9.5px] text-apax-gold">
              {initials || 'NR'}
            </div>
            <div className="text-[12px] text-apax-text2">{user?.fullName ?? 'Guest'}</div>
          </Link>
        </div>
      </div>
    </header>
  );
}
