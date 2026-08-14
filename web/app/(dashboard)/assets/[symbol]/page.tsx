'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useHoldings, useActivity } from '@/lib/hooks';
import { METAL_REFERENCE, TRANSACTION_TYPE_LABEL, STATUS_COLOR, G_PER_OZ } from '@/lib/metals';
import { usd, num, signedPct } from '@/lib/format';
import { MonoLabel, Panel, PrimaryButton, SecondaryButton } from '@/components/ui/Primitives';
import type { MetalKey } from '@/lib/types';

const SPOT_SERIES: Record<MetalKey, number[]> = {
  gold: [2210, 2244, 2231, 2268, 2290, 2275, 2302, 2331, 2318, 2340, 2336, 2342.5],
  silver: [26.4, 26.9, 27.1, 26.8, 27.3, 27.6, 27.4, 27.7, 27.9, 27.6, 27.8, 27.85],
  platinum: [1062, 1054, 1048, 1039, 1044, 1031, 1036, 1028, 1033, 1027, 1029, 1024.3],
};
const MONTH_LABELS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export default function AssetDetailPage() {
  const params = useParams<{ symbol: string }>();
  const asset = params.symbol as MetalKey;
  if (!['gold', 'silver', 'platinum'].includes(asset)) notFound();

  const ref = METAL_REFERENCE[asset];
  const { holdings } = useHoldings();
  const { transactions } = useActivity();

  const holding = holdings.find((h) => h.asset === asset);
  const oz = (holding?.grams ?? 0) / G_PER_OZ;
  const value = oz * ref.spotUsdPerOz;
  const assetActivity = transactions.filter((t) => t.asset === asset);
  const series = SPOT_SERIES[asset];
  const max = Math.max(...series) * 1.02;
  const min = Math.min(...series) * 0.98;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-apax-border pb-[18px]">
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[.2em] text-apax-gold">
            Allocated asset · {ref.symbol}
          </div>
          <h1 className="mt-2.5 font-serif text-4xl font-medium text-apax-text">{ref.label}</h1>
        </div>
        <div className="text-right">
          <div className="font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim">Spot / ozt</div>
          <div className="mt-1 flex items-baseline justify-end gap-2">
            <div className="text-xl tabular-nums text-apax-text">{usd(ref.spotUsdPerOz)}</div>
            <div
              className="font-mono text-[10px]"
              style={{ color: ref.dailyChangePct >= 0 ? '#5E9C7B' : '#B4685E' }}
            >
              {signedPct(ref.dailyChangePct)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[18px] flex gap-0.5">
        {(['gold', 'silver', 'platinum'] as MetalKey[]).map((key) => (
          <Link
            key={key}
            href={`/assets/${key}`}
            className="px-[18px] py-2.5 text-[13px]"
            style={{
              borderBottom: `2px solid ${key === asset ? METAL_REFERENCE[key].color : '#23272C'}`,
              color: key === asset ? '#E8E6E1' : '#8B9199',
            }}
          >
            {METAL_REFERENCE[key].label}
          </Link>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="border border-apax-border bg-apax-panel px-6 py-[22px]">
          <div className="flex items-baseline justify-between">
            <MonoLabel>Spot history · 12 months</MonoLabel>
            <div className="font-mono text-[9.5px] text-apax-dim2">USD per troy ounce</div>
          </div>
          <div className="mt-[22px] flex h-[210px] items-end gap-1.5 border-b border-apax-border pb-px">
            {series.map((v, i) => (
              <div key={i} className="flex h-full flex-1 items-end">
                <div
                  className="w-full"
                  style={{
                    background: ref.color,
                    opacity: 0.35 + 0.55 * (i / (series.length - 1)),
                    height: `${(((v - min) / (max - min)) * 100).toFixed(1)}%`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            {MONTH_LABELS.map((m) => (
              <div key={m} className="flex-1 text-center font-mono text-[9px] text-apax-dim2">
                {m}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col border border-apax-border bg-apax-panel px-6 py-[22px]">
          <MonoLabel>Your holding</MonoLabel>
          <div className="mt-3.5 font-serif text-[34px] font-medium tabular-nums text-apax-text">
            {holding ? usd(value) : usd(0)}
          </div>
          <div className="mt-1.5 font-mono text-[11px] tabular-nums text-apax-muted">
            {num(holding?.grams ?? 0, 2)} g · {num(oz, 4)} ozt
          </div>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-apax-border pt-4">
            <Row label="Fineness" value={holding?.fineness ?? ref.symbol} />
            <Row label="Form" value={holding?.form ?? '—'} />
            <Row label="Custodian" value={holding?.custodian ?? '—'} />
            <Row label="Bar serials" value={holding?.barSerials.join(' · ') || '—'} gold />
          </div>
          <div className="mt-auto flex gap-2.5 pt-6">
            <Link href="/buy" className="flex-1">
              <PrimaryButton className="w-full">Buy {ref.label}</PrimaryButton>
            </Link>
            <Link href="/redeem" className="flex-1">
              <SecondaryButton className="w-full">Redeem</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>

      <Panel className="mt-4">
        <div className="border-b border-apax-border px-[22px] py-4">
          <MonoLabel>{ref.label} transactions</MonoLabel>
        </div>
        <div className="grid grid-cols-[1.1fr_.8fr_.8fr_.8fr_1fr] gap-3 border-b border-apax-border px-[22px] py-2.5">
          {['Type', 'Quantity', 'Value', 'Status', 'Reference'].map((h, i) => (
            <div
              key={h}
              className={`font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim2 ${i > 0 ? 'text-right' : ''}`}
            >
              {h}
            </div>
          ))}
        </div>
        {assetActivity.length === 0 ? (
          <div className="px-[22px] py-6 text-[13px] text-apax-muted">No {ref.label.toLowerCase()} transactions yet.</div>
        ) : (
          assetActivity.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1.1fr_.8fr_.8fr_.8fr_1fr] items-center gap-3 border-b border-apax-line px-[22px] py-3.5 last:border-b-0"
            >
              <div className="text-[13px] text-apax-text">{TRANSACTION_TYPE_LABEL[row.type]}</div>
              <div className="text-right font-mono text-[11px] tabular-nums text-apax-text2">
                {num(row.quantityGrams, 3)} g
              </div>
              <div className="text-right text-xs tabular-nums text-apax-text2">{usd(row.valueUsd)}</div>
              <div
                className="text-right font-mono text-[9.5px] uppercase tracking-[.1em]"
                style={{ color: STATUS_COLOR[row.status] }}
              >
                {row.status}
              </div>
              <div className="text-right font-mono text-[10.5px] text-apax-gold">{row.reference}</div>
            </div>
          ))
        )}
      </Panel>
    </section>
  );
}

function Row({ label, value, gold = false }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-apax-muted">{label}</span>
      <span
        className={`text-right font-mono text-[10.5px] ${gold ? 'text-apax-gold' : 'text-apax-text2'}`}
      >
        {value}
      </span>
    </div>
  );
}
