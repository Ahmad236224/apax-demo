'use client';

import { useViewStore } from '@/lib/store/ui';

export function StatusBanner() {
  const { view } = useViewStore();

  if (view === 'error') {
    return (
      <div className="mb-[22px] flex items-start gap-3 border border-apax-redBorder bg-apax-redBg px-4 py-3.5">
        <div className="mt-1.5 h-1.5 w-1.5 flex-none bg-apax-red" />
        <div>
          <div className="text-[13px] font-medium text-apax-text">
            Spot feed unreachable — figures below are from the last known price
          </div>
          <div className="mt-1 text-[12px] text-apax-muted">
            The custody ledger is unaffected and your holdings are intact. Buying and redeeming
            are paused until pricing resumes.
          </div>
        </div>
      </div>
    );
  }

  if (view === 'gated') {
    return (
      <div className="mb-[22px] flex items-start gap-3 border border-apax-goldDim bg-apax-goldBg px-4 py-3.5">
        <div className="mt-1.5 h-1.5 w-1.5 flex-none bg-apax-gold" />
        <div>
          <div className="text-[13px] font-medium text-apax-text">
            Verification pending — you can view, not transact
          </div>
          <div className="mt-1 text-[12px] text-apax-muted">
            Compliance is reviewing your documents, usually within one business day. Buying and
            redeeming unlock when the review clears.{' '}
            <a href="/verify" className="text-apax-gold hover:text-apax-goldHover">
              See what&apos;s outstanding
            </a>
            .
          </div>
        </div>
      </div>
    );
  }

  if (view === 'pending') {
    return (
      <div className="mb-[22px] flex items-center gap-3 border border-apax-border bg-apax-panel px-4 py-3.5">
        <div className="h-1.5 w-1.5 animate-apaxPulse bg-apax-gold" />
        <div className="flex-1">
          <div className="text-[13px] font-medium text-apax-text">Mint in flight</div>
          <div className="mt-1 text-[12px] text-apax-muted">
            Custody deposit confirmed. Tokens are issued once the vault countersigns; nothing else
            is required from you.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
