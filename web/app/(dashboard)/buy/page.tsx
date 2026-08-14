'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBuyStore } from '@/lib/store/ui';
import { useViewStore } from '@/lib/store/ui';
import { METAL_REFERENCE, G_PER_OZ } from '@/lib/metals';
import { usd, num } from '@/lib/format';
import { PrimaryButton, SecondaryButton, GhostButton, SectionHeading } from '@/components/ui/Primitives';
import { apiFetch } from '@/lib/api';

const STEPS = [
  { n: '01', title: 'Enter amount', sub: 'Weight or currency' },
  { n: '02', title: 'Review order', sub: 'Fees and custody' },
  { n: '03', title: 'Vault confirms', sub: 'Bullion allocated' },
  { n: '04', title: 'Tokens issued', sub: 'Receipt and serials' },
];

export default function BuyPage() {
  const { step, asset, weightGrams, setWeightGrams, toReview, toPending, toReceipt, back, reset } = useBuyStore();
  const { view } = useViewStore();
  const gated = view === 'gated';
  const ref = METAL_REFERENCE[asset];
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const grams = Number(weightGrams) || 0;
  const value = (grams / G_PER_OZ) * ref.spotUsdPerOz;
  const fee = value * 0.005;
  const storage = 1.2;
  const total = value + fee + storage;

  async function confirmAndPay() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await apiFetch<{ transaction: { id: string; reference: string } }>('/api/buy', {
        method: 'POST',
        body: { asset, grams },
      });
      setReference(res.transaction.reference);
      toPending();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit order');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <SectionHeading
        eyebrow="Deposit to mint"
        title={`Buy ${ref.label.toLowerCase()}`}
        description="You buy allocated metal held in custody. Tokens are minted only after the vault confirms the bullion is in custody, one token per gram."
      />

      <div className="mt-[22px] grid grid-cols-4 border border-apax-border">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`px-[18px] py-4 ${i < 3 ? 'border-r border-apax-border' : ''}`}
            style={{ background: step === i + 1 ? '#15181C' : 'transparent' }}
          >
            <div className="font-mono text-[10px]" style={{ color: step >= i + 1 ? '#C8A253' : '#4A5057' }}>
              {s.n}
            </div>
            <div className="mt-2 text-[13px]" style={{ color: step >= i + 1 ? '#E8E6E1' : '#8B9199' }}>
              {s.title}
            </div>
            <div className="mt-1 font-mono text-[9.5px] text-apax-dim2">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
          {step === 1 ? (
            <div>
              <div className="flex w-fit gap-0.5 border border-apax-border">
                {(['gold', 'silver', 'platinum'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => useBuyStore.getState().setAsset(key)}
                    className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-[.12em]"
                    style={{
                      background: asset === key ? '#1F242A' : 'transparent',
                      color: asset === key ? '#E8E6E1' : '#8B9199',
                    }}
                  >
                    {METAL_REFERENCE[key].label}
                  </button>
                ))}
              </div>
              <div className="mt-[22px] font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
                Grams of {ref.label.toLowerCase()}
              </div>
              <div className="mt-2.5 flex items-baseline gap-2.5 border-b border-apax-border2 pb-2.5">
                <input
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value)}
                  inputMode="decimal"
                  className="w-full bg-transparent font-serif text-[44px] tabular-nums text-apax-text outline-none"
                />
                <span className="font-mono text-[13px] text-apax-dim">g</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-[11px] tabular-nums text-apax-muted">
                  = {num(grams / G_PER_OZ, 4)} ozt · {usd(value)} at spot
                </div>
                <div className="flex gap-1.5">
                  {[10, 50, 100].map((p) => (
                    <button
                      key={p}
                      onClick={() => setWeightGrams(String(p))}
                      className="border border-apax-border2 px-2.5 py-1 font-mono text-[10px] text-apax-muted hover:border-apax-gold hover:text-apax-text"
                    >
                      {p} g
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
                Confirm your order
              </div>
              <h2 className="mt-3 font-serif text-[28px] font-medium text-apax-text">
                {num(grams, 3)} g of {ref.label.toLowerCase()}
              </h2>
              <p className="mt-2.5 text-[13px] text-apax-muted">
                Price is locked for 90 seconds from the moment you confirm. Nothing is issued
                against unallocated metal.
              </p>
              {submitError ? (
                <div className="mt-4 border border-apax-redBorder bg-apax-redBg px-3.5 py-3 text-[12px] text-apax-text">
                  {submitError}
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 animate-apaxPulse bg-apax-gold" />
                <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-gold">
                  Awaiting vault countersignature
                </div>
              </div>
              <h2 className="mt-4 font-serif text-[28px] font-medium text-apax-text">
                Your metal is being allocated
              </h2>
              <p className="mt-2.5 max-w-lg text-[13px] text-apax-muted">
                This usually settles quickly. You can leave this page — the receipt will be in
                your activity log. Reference: {reference}
              </p>
              <SecondaryButton className="mt-[22px]" onClick={toReceipt}>
                Simulate vault settlement
              </SecondaryButton>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 bg-apax-green" />
                <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-green">
                  Minted · receipt {reference}
                </div>
              </div>
              <h2 className="mt-4 font-serif text-[28px] font-medium text-apax-text">
                {num(grams, 3)} g of {ref.label.toLowerCase()} is yours
              </h2>
              <div className="mt-[22px] flex gap-2.5">
                <Link href="/">
                  <PrimaryButton>Back to portfolio</PrimaryButton>
                </Link>
                <SecondaryButton onClick={reset}>Buy more metal</SecondaryButton>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border border-apax-border bg-apax-panel px-6 py-[22px]">
          <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">Order</div>
          <div className="mt-4 font-serif text-[22px] font-medium text-apax-text">
            {num(grams, 3)} g {ref.label.toLowerCase()}
          </div>
          <div className="mt-[18px] flex flex-col gap-2.5 border-t border-apax-border pt-4">
            <Row label="Metal value" value={usd(value)} />
            <Row label="Minting fee (0.50%)" value={usd(fee)} />
            <Row label="First-month storage" value={usd(storage)} />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-apax-border2 pt-4">
            <span className="text-[13px] font-semibold text-apax-text">Total due</span>
            <span className="font-serif text-[22px] tabular-nums text-apax-gold">{usd(total)}</span>
          </div>

          {gated ? (
            <div className="mt-[22px] border border-apax-goldDim bg-apax-goldBg px-3.5 py-3.5">
              <div className="text-[12px] font-medium text-apax-text">
                Buying is blocked until verification clears
              </div>
              <Link href="/verify">
                <GhostButton className="mt-3 block w-full py-2 text-center">
                  Check verification status
                </GhostButton>
              </Link>
            </div>
          ) : (
            <div className="mt-[22px]">
              {step === 1 ? (
                <PrimaryButton className="w-full py-2.5" onClick={toReview} disabled={grams <= 0}>
                  Review order
                </PrimaryButton>
              ) : null}
              {step === 2 ? (
                <>
                  <PrimaryButton className="w-full py-2.5" onClick={confirmAndPay} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Confirm and pay'}
                  </PrimaryButton>
                  <GhostButton className="mt-2 block w-full py-2 text-center" onClick={back}>
                    Change amount
                  </GhostButton>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-apax-muted">{label}</span>
      <span className="text-xs tabular-nums text-apax-text2">{value}</span>
    </div>
  );
}
