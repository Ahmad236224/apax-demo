'use client';

import { useEffect, useState } from 'react';
import { useObligationStore } from '@/lib/store/ui';
import { useHoldings } from '@/lib/hooks';
import { METAL_REFERENCE, G_PER_OZ } from '@/lib/metals';
import { usd } from '@/lib/format';
import { SectionHeading } from '@/components/ui/Primitives';

const ADMIN_RATE_PCT = 0.1;
const ZAKAT_RATE_PCT = 2.5;
const TIER_RATE_PCT = { standard: 0.35, institutional: 0.22 };

export default function ObligationsPage() {
  const { periodMonths, tier, setPeriodMonths, setTier } = useObligationStore();
  const { holdings, status } = useHoldings();

  const portfolioValue = holdings.reduce((sum, h) => {
    const ref = METAL_REFERENCE[h.asset];
    return sum + (h.grams / G_PER_OZ) * ref.spotUsdPerOz;
  }, 0);

  const [baseText, setBaseText] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched && status === 'success') {
      setBaseText(portfolioValue.toFixed(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, portfolioValue]);

  const base = Number(baseText) || 0;
  const rate = TIER_RATE_PCT[tier];
  const custody = base * (rate / 100) * (periodMonths / 12);
  const admin = base * (ADMIN_RATE_PCT / 100) * (periodMonths / 12);
  const zakatOn = periodMonths >= 12;
  const zakat = zakatOn ? base * (ZAKAT_RATE_PCT / 100) : 0;
  const total = custody + admin + zakat;
  const periodText = `${periodMonths} mo`;

  return (
    <section>
      <SectionHeading
        eyebrow="Transparent calculation"
        title="Asset obligations"
        description="Work out what you owe on metal you hold — custody, administration, and zakat where a full lunar year has passed. Every figure below shows the arithmetic that produced it."
      />

      <div className="mt-[22px] grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_1.25fr]">
        <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
          <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">Inputs</div>

          <div className="mt-[18px]">
            <div className="text-xs text-apax-muted">Holdings basis</div>
            <div className="mt-2 flex items-baseline justify-between gap-3 border border-apax-border2 px-3.5 py-3">
              <span className="text-[13px] text-apax-text">Your live portfolio</span>
              <input
                value={baseText}
                onChange={(e) => {
                  setTouched(true);
                  setBaseText(e.target.value);
                }}
                inputMode="decimal"
                className="w-32 bg-transparent text-right text-[13px] tabular-nums text-apax-gold outline-none"
              />
            </div>
            <div className="mt-1.5 font-mono text-[9.5px] text-apax-dim2">
              Pulled from your allocation · edit to model a different amount
            </div>
          </div>

          <div className="mt-[22px]">
            <div className="text-xs text-apax-muted">Holding period · {periodText}</div>
            <input
              type="range"
              min={1}
              max={36}
              step={1}
              value={periodMonths}
              onChange={(e) => setPeriodMonths(Number(e.target.value))}
              className="mt-2.5 w-full accent-apax-gold"
            />
            <div className="flex justify-between font-mono text-[9.5px] text-apax-dim2">
              <span>1 mo</span>
              <span>36 mo</span>
            </div>
          </div>

          <div className="mt-[22px]">
            <div className="text-xs text-apax-muted">Custody tier</div>
            <div className="mt-2.5 flex w-fit gap-0.5 border border-apax-border">
              <button
                onClick={() => setTier('standard')}
                className="px-3.5 py-2 font-mono text-[10px] uppercase tracking-[.1em]"
                style={{
                  background: tier === 'standard' ? '#1F242A' : 'transparent',
                  color: tier === 'standard' ? '#E8E6E1' : '#8B9199',
                }}
              >
                Standard 0.35%
              </button>
              <button
                onClick={() => setTier('institutional')}
                className="px-3.5 py-2 font-mono text-[10px] uppercase tracking-[.1em]"
                style={{
                  background: tier === 'institutional' ? '#1F242A' : 'transparent',
                  color: tier === 'institutional' ? '#E8E6E1' : '#8B9199',
                }}
              >
                Institutional 0.22%
              </button>
            </div>
          </div>
        </div>

        <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
          <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
            Calculated obligation
          </div>
          <div className="mt-3.5 font-serif text-5xl font-medium tabular-nums text-apax-text">
            {usd(total)}
          </div>
          <div className="mt-1 font-mono text-[10px] text-apax-dim">
            over {periodText} · not deducted automatically
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-apax-border pt-[18px]">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-apax-text">Custody and storage</span>
                <span className="text-[13px] tabular-nums text-apax-text2">{usd(custody)}</span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-apax-dim">
                {usd(base)} × {rate.toFixed(2)}% × {periodText} ÷ 12
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-apax-text">Administration</span>
                <span className="text-[13px] tabular-nums text-apax-text2">{usd(admin)}</span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-apax-dim">
                {usd(base)} × 0.10% p.a. × {periodText} ÷ 12
              </div>
            </div>
            {zakatOn ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-apax-text">Zakat on metal</span>
                  <span className="text-[13px] tabular-nums text-apax-text2">{usd(zakat)}</span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] text-apax-dim">
                  {usd(base)} × 2.5% · one lunar year has elapsed on this holding
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-[22px] border border-apax-border bg-apax-panel2 px-4 py-3.5">
            <div className="font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim">Formula</div>
            <div className="mt-2 font-mono text-[10.5px] leading-[1.8] text-apax-text2">
              total = base × custody_rate × months÷12 + base × 0.10% × months÷12
              {zakatOn ? ' + base × 2.5%' : ''}
            </div>
          </div>
          <div className="mt-3.5 text-xs text-apax-muted">
            This is a calculation tool, not tax advice. Zakat treatment of allocated metal varies
            by school; the Sidra Advisory Board&apos;s position is published in SHC-2026-041.
          </div>
        </div>
      </div>
    </section>
  );
}
