'use client';

import Link from 'next/link';
import { useHoldings, useActivity, useReserve } from '@/lib/hooks';
import { useViewStore } from '@/lib/store/ui';
import { METAL_REFERENCE, TRANSACTION_TYPE_LABEL, STATUS_COLOR, G_PER_OZ } from '@/lib/metals';
import { usd, num } from '@/lib/format';
import {
  EmptyState,
  ErrorBanner,
  MonoLabel,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SkeletonBlock,
} from '@/components/ui/Primitives';
import type { Holding } from '@/lib/types';

export default function PortfolioPage() {
  const { view } = useViewStore();
  const { holdings, status: holdingsStatus, error: holdingsError, reload } = useHoldings();
  const { transactions } = useActivity();
  const { reserves } = useReserve();

  const effectiveStatus = view === 'loading' || view === 'empty' || view === 'error' ? view : holdingsStatus;

  if (effectiveStatus === 'loading') {
    return (
      <section>
        <PortfolioHeading />
        <div className="mt-6 grid grid-cols-1 gap-px border border-apax-border bg-apax-border lg:grid-cols-2">
          <div className="bg-apax-panel p-7">
            <SkeletonBlock className="h-2.5 w-32" />
            <SkeletonBlock className="mt-5 h-11 w-64" />
          </div>
          <div className="bg-apax-panel p-7">
            <SkeletonBlock className="h-2.5 w-32" />
            <SkeletonBlock className="mt-5 h-40 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (effectiveStatus === 'error') {
    return (
      <section>
        <PortfolioHeading />
        <div className="mt-6">
          <ErrorBanner message={holdingsError ?? 'The spot feed stopped responding.'} onRetry={reload} />
        </div>
      </section>
    );
  }

  if (effectiveStatus === 'empty' || holdings.length === 0) {
    return (
      <section>
        <PortfolioHeading />
        <EmptyState
          title="No metal allocated yet"
          description="Your vault account is open and verified. Buy your first gram of gold, silver or platinum, or deposit bullion you already own to have it tokenised 1:1."
          action={
            <>
              <Link href="/buy">
                <PrimaryButton>Buy metal</PrimaryButton>
              </Link>
              <Link href="/reserve">
                <SecondaryButton>Read the reserve attestation</SecondaryButton>
              </Link>
            </>
          }
        />
      </section>
    );
  }

  const enriched = holdings.map((h) => {
    const ref = METAL_REFERENCE[h.asset];
    const oz = h.grams / G_PER_OZ;
    const value = oz * ref.spotUsdPerOz;
    return { ...h, value, oz, ref };
  });
  const total = enriched.reduce((a, b) => a + b.value, 0);
  const totalGrams = enriched.reduce((a, b) => a + b.grams, 0);
  const recent = transactions.slice(0, 5);

  return (
    <section>
      <PortfolioHeading />

      <div className="mt-6 grid grid-cols-1 gap-px border border-apax-border bg-apax-border lg:grid-cols-2">
        <div className="flex flex-col bg-apax-panel px-7 py-[26px]">
          <MonoLabel>Total holdings value</MonoLabel>
          <div className="mt-3.5 flex items-baseline">
            <span className="mr-1.5 font-serif text-xl text-apax-dim">$</span>
            <span className="font-serif text-5xl font-medium leading-none tabular-nums text-apax-text">
              {Math.floor(total).toLocaleString('en-US')}
            </span>
            <span className="font-serif text-2xl tabular-nums text-apax-muted">
              .{total.toFixed(2).split('.')[1]}
            </span>
          </div>
          <div className="mt-auto grid grid-cols-3 gap-[18px] border-t border-apax-border pt-[18px]">
            <Stat label="Tokens held" value={num(totalGrams, 2)} />
            <Stat label="Metal weight" value={`${num(totalGrams / 1000, 3)} kg`} />
            <Stat label="Custody" value="Allocated" sub={`${enriched.length} lots`} />
          </div>
        </div>

        <div className="bg-apax-panel px-7 py-[26px]">
          <div className="flex items-baseline justify-between">
            <MonoLabel>Assay stack · allocation</MonoLabel>
            <div className="font-mono text-[9.5px] uppercase tracking-[.12em] text-apax-dim2">
              By spot value
            </div>
          </div>
          <div className="mt-5 flex flex-col">
            {enriched.map((h) => {
              const pct = (h.value / total) * 100;
              return (
                <Link
                  key={h.id}
                  href={`/assets/${h.asset}`}
                  className="block border-b border-apax-border py-3 last:border-b-0 hover:bg-apax-panel2"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5" style={{ background: h.ref.color }} />
                      <div className="text-sm text-apax-text">{h.ref.label}</div>
                      <div className="font-mono text-[9.5px] text-apax-dim">{h.ref.symbol}</div>
                    </div>
                    <div className="text-sm tabular-nums text-apax-text">{usd(h.value)}</div>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <div className="font-mono text-[9.5px] text-apax-dim">
                      {num(h.grams, 2)} g · {h.fineness}
                    </div>
                    <div className="font-mono text-[10px] tabular-nums text-apax-muted">
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enriched.map((h) => (
          <HoldingCard key={h.id} holding={h} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="flex items-baseline justify-between border-b border-apax-border px-[22px] py-[18px]">
            <MonoLabel>Recent activity</MonoLabel>
            <Link href="/activity" className="font-mono text-[9.5px] uppercase tracking-[.12em] text-apax-gold hover:text-apax-goldHover">
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-[22px] py-6 text-[13px] text-apax-muted">No activity yet.</div>
          ) : (
            recent.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1.2fr_.9fr_.8fr_.8fr] items-center gap-3 border-b border-apax-line px-[22px] py-3.5 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 flex-none" style={{ background: METAL_REFERENCE[row.asset].color }} />
                  <div className="whitespace-nowrap text-[13px] text-apax-text">
                    {TRANSACTION_TYPE_LABEL[row.type]}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] tabular-nums text-apax-muted">
                  {num(row.quantityGrams, 3)} g
                </div>
                <div className="text-right text-xs tabular-nums text-apax-text2">{usd(row.valueUsd)}</div>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[row.status] }} />
                  <div className="font-mono text-[9.5px] uppercase tracking-[.1em] text-apax-muted">
                    {row.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </Panel>

        <div className="border border-apax-border bg-apax-panel px-[22px] py-5">
          <div className="flex items-center justify-between">
            <MonoLabel>Proof of reserve</MonoLabel>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-apax-green" />
              <div className="font-mono text-[9px] uppercase tracking-[.12em] text-apax-green">
                All matched
              </div>
            </div>
          </div>
          {reserves.map((r) => {
            const ratio = (r.auditedReserveGrams / r.mintedSupplyGrams) * 100;
            const ref = METAL_REFERENCE[r.asset];
            return (
              <div key={r.id} className="mt-4 border-b border-apax-line pb-3.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[13px] text-apax-text">{ref.label}</div>
                  <div className="font-mono text-[10px] tabular-nums text-apax-text2">
                    {ratio.toFixed(2)}%
                  </div>
                </div>
                <div className="mt-2 h-[3px] bg-apax-border">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, (r.mintedSupplyGrams / r.auditedReserveGrams) * 100).toFixed(2)}%`,
                      background: ref.color,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[9.5px] text-apax-dim">
                  <span>{num(r.mintedSupplyGrams / 1000, 2)} kg minted</span>
                  <span>{num(r.auditedReserveGrams / 1000, 2)} kg in vault</span>
                </div>
              </div>
            );
          })}
          <Link
            href="/reserve"
            className="mt-4 block w-full border border-apax-border2 py-2.5 text-center text-[12px] text-apax-text2 hover:border-apax-gold hover:text-apax-text"
          >
            Open the audit hub
          </Link>
        </div>
      </div>
    </section>
  );
}

function PortfolioHeading() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-apax-border pb-5">
      <div>
        <div className="font-mono text-[9.5px] uppercase tracking-[.2em] text-apax-gold">
          Private client · allocated holdings
        </div>
        <h1 className="mt-2.5 font-serif text-4xl font-medium tracking-tight text-apax-text">
          Portfolio
        </h1>
      </div>
      <div className="flex items-center gap-2.5">
        <Link href="/buy">
          <PrimaryButton>Buy metal</PrimaryButton>
        </Link>
        <Link href="/redeem">
          <SecondaryButton>Redeem</SecondaryButton>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim">{label}</div>
      <div className="mt-1.5 text-[19px] tabular-nums text-apax-text">{value}</div>
      {sub ? <div className="mt-0.5 font-mono text-[9.5px] text-apax-dim">{sub}</div> : null}
    </div>
  );
}

function HoldingCard({ holding }: { holding: Holding & { value: number; oz: number; ref: (typeof METAL_REFERENCE)['gold'] } }) {
  return (
    <Link
      href={`/assets/${holding.asset}`}
      className="block border border-apax-border bg-apax-panel px-[22px] py-5 hover:border-apax-border2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5" style={{ background: holding.ref.color }} />
          <div className="text-sm font-medium text-apax-text">{holding.ref.label}</div>
          <div className="font-mono text-[9.5px] text-apax-dim">{holding.fineness}</div>
        </div>
      </div>
      <div className="mt-4 font-serif text-[27px] font-medium tabular-nums text-apax-text">
        {usd(holding.value)}
      </div>
      <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-apax-border pt-3.5">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[.14em] text-apax-dim">Weight</div>
          <div className="mt-1 text-[13px] tabular-nums text-apax-text2">{num(holding.grams, 2)} g</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[.14em] text-apax-dim">Spot</div>
          <div className="mt-1 text-[13px] tabular-nums text-apax-text2">
            {usd(holding.ref.spotUsdPerOz)}
          </div>
        </div>
      </div>
      <div className="mt-3.5 font-mono text-[9.5px] text-apax-dim2">{holding.custodian}</div>
    </Link>
  );
}
