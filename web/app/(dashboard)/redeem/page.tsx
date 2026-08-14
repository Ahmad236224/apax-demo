'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRedeemStore } from '@/lib/store/ui';
import { useViewStore } from '@/lib/store/ui';
import { useHoldings } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store/auth';
import { METAL_REFERENCE, G_PER_OZ } from '@/lib/metals';
import { usd, num } from '@/lib/format';
import { GhostButton, PrimaryButton, SecondaryButton } from '@/components/ui/Primitives';
import { apiFetch } from '@/lib/api';

const STEPS = [
  { n: '01', title: 'Choose method', sub: 'Delivery or settlement' },
  { n: '02', title: 'Quantity and address', sub: 'Where it ships' },
  { n: '03', title: 'Authorise burn', sub: 'Irreversible' },
  { n: '04', title: 'Track settlement', sub: 'Requested → settled' },
];

const REDEMPTION_FEE_RATE = 0.01;

export default function RedeemPage() {
  const { step, asset, method, grams, setAsset, setMethod, setGrams, next, back, reset } = useRedeemStore();
  const { view } = useViewStore();
  const { holdings } = useHoldings();
  const { user } = useAuthStore();
  const gated = view === 'gated';
  const ref = METAL_REFERENCE[asset];
  const holding = holdings.find((h) => h.asset === asset);

  const [name, setName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [ackBurn, setAckBurn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const quantity = Number(grams) || 0;
  const value = (quantity / G_PER_OZ) * ref.spotUsdPerOz;
  const fee = value * REDEMPTION_FEE_RATE;
  const receive = value - fee;
  const available = holding?.grams ?? 0;
  const exceedsAvailable = quantity > available;

  async function authoriseBurn() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await apiFetch<{ transaction: { reference: string } }>('/api/redeem', {
        method: 'POST',
        body: { asset, grams: quantity, method },
      });
      setReference(res.transaction.reference);
      next();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit redemption');
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    reset();
    setAckBurn(false);
    setSubmitError(null);
    setReference(null);
  }

  return (
    <section>
      <div className="border-b border-apax-border pb-[18px]">
        <div className="font-mono text-[9.5px] uppercase tracking-[.2em] text-apax-gold">
          Burn to release
        </div>
        <h1 className="mt-2.5 font-serif text-4xl font-medium text-apax-text">Redeem metal</h1>
        <p className="mt-2.5 max-w-xl text-[13px] text-apax-muted">
          Redeeming burns your tokens and releases the underlying bullion. Choose insured physical
          delivery or an approved cash settlement at the vault&apos;s published fix.
        </p>
      </div>

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
                    onClick={() => setAsset(key)}
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
                Redemption method
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setMethod('delivery')}
                  className="block px-[18px] py-4 text-left"
                  style={{
                    border: `1px solid ${method === 'delivery' ? '#4A3C22' : '#23272C'}`,
                    background: method === 'delivery' ? '#191712' : 'transparent',
                  }}
                >
                  <div className="text-sm font-medium text-apax-text">Physical delivery</div>
                  <div className="mt-1.5 text-xs text-apax-muted">
                    Insured courier from the vault to your address. 5–15 business days, 100+
                    countries.
                  </div>
                  <div
                    className="mt-2.5 font-mono text-[9px] uppercase tracking-[.12em]"
                    style={{ color: method === 'delivery' ? '#C8A253' : '#4A5057' }}
                  >
                    {method === 'delivery' ? 'Selected' : 'Choose'}
                  </div>
                </button>
                <button
                  onClick={() => setMethod('settlement')}
                  className="block px-[18px] py-4 text-left"
                  style={{
                    border: `1px solid ${method === 'settlement' ? '#4A3C22' : '#23272C'}`,
                    background: method === 'settlement' ? '#191712' : 'transparent',
                  }}
                >
                  <div className="text-sm font-medium text-apax-text2">Approved settlement</div>
                  <div className="mt-1.5 text-xs text-apax-muted">
                    The vault buys the metal at the daily fix and pays your verified bank account
                    in 2 business days.
                  </div>
                  <div
                    className="mt-2.5 font-mono text-[9px] uppercase tracking-[.12em]"
                    style={{ color: method === 'settlement' ? '#C8A253' : '#4A5057' }}
                  >
                    {method === 'settlement' ? 'Selected' : 'Choose'}
                  </div>
                </button>
              </div>

              <div className="mt-[26px] border-t border-apax-border pt-5">
                <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
                  Quantity · {ref.label.toLowerCase()}
                </div>
                <div className="mt-2.5 flex items-baseline gap-2.5 border-b border-apax-border2 pb-2.5">
                  <input
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-transparent font-serif text-[40px] tabular-nums text-apax-text outline-none"
                  />
                  <span className="font-mono text-[13px] text-apax-dim">g</span>
                </div>
                <div className="mt-2.5 font-mono text-[11px] text-apax-muted">
                  Available {num(available, 2)} g · smallest deliverable unit is a 10 g cast bar
                </div>
                {exceedsAvailable ? (
                  <div className="mt-2.5 text-[12px] text-apax-red">
                    You only have {num(available, 2)} g of {ref.label.toLowerCase()} allocated.
                  </div>
                ) : null}
              </div>

              {method === 'delivery' ? (
                <div className="mt-[26px] border-t border-apax-border pt-5">
                  <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
                    Delivery address
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-3.5">
                    <TextField label="Full name" value={name} onChange={setName} />
                    <TextField label="Phone for courier" value={phone} onChange={setPhone} />
                    <TextField label="Street address" value={street} onChange={setStreet} span2 />
                    <TextField label="City" value={city} onChange={setCity} />
                    <TextField label="Country" value={country} onChange={setCountry} />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="border border-apax-redBorder bg-apax-redBg px-4 py-4">
                <div className="text-[13px] font-medium text-apax-text">
                  Burning tokens cannot be undone
                </div>
                <div className="mt-1.5 text-xs text-apax-muted">
                  {num(quantity, 3)} g of {ref.label.toLowerCase()} tokens will be destroyed
                  on-chain and the matching bullion leaves your allocation. If you want the metal
                  back afterwards you have to buy it again at the prevailing price.
                </div>
              </div>
              <div className="mt-[22px] flex flex-col gap-px border border-apax-border bg-apax-border">
                <SummaryRow label="Metal released" value={`${num(quantity, 3)} g ${ref.label.toLowerCase()}, ${ref.symbol}`} />
                <SummaryRow
                  label="Method"
                  value={method === 'delivery' ? 'Physical delivery' : 'Approved settlement'}
                />
                {method === 'delivery' ? (
                  <SummaryRow label="Ships to" value={[street, city, country].filter(Boolean).join(', ') || '—'} />
                ) : null}
                <SummaryRow label="Tokens burned" value={`${num(quantity, 3)} ${ref.symbol}`} />
              </div>
              {submitError ? (
                <div className="mt-4 border border-apax-redBorder bg-apax-redBg px-3.5 py-3 text-[12px] text-apax-text">
                  {submitError}
                </div>
              ) : null}
              <label className="mt-5 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={ackBurn}
                  onChange={(e) => setAckBurn(e.target.checked)}
                  className="mt-0.5 accent-apax-gold"
                />
                <span className="text-xs text-apax-text2">
                  I understand the burn is irreversible and I authorise the vault to release my
                  bullion{method === 'delivery' ? ' to the address above' : ''}.
                </span>
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-gold">
                Redemption {reference}
              </div>
              <h2 className="mt-3.5 font-serif text-[28px] font-medium text-apax-text">
                Requested — the vault is preparing your bullion
              </h2>
              <div className="mt-[26px] flex flex-col">
                <TrackRow title="Requested" desc="Tokens burned on-chain" tone="done" last={false} />
                <TrackRow title="Approved by compliance" desc="Sanctions and address screening cleared" tone="done" last={false} />
                <TrackRow
                  title="In custody transfer"
                  desc={method === 'delivery' ? 'Bullion withdrawn from the vault, awaiting courier collection' : 'Settlement queued against the daily fix'}
                  tone="active"
                  last={false}
                />
                <TrackRow title="Settled" desc="Signature on delivery closes the redemption" tone="idle" last />
              </div>
              <div className="mt-[26px] flex gap-2.5">
                <Link href="/activity">
                  <SecondaryButton>See it in activity</SecondaryButton>
                </Link>
                <GhostButton onClick={startOver}>Start another redemption</GhostButton>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border border-apax-border bg-apax-panel px-6 py-[22px]">
          <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
            Obligations and fees
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <Row label="Metal value at spot" value={usd(value)} />
            <Row label="Redemption fee (1.00%)" value={`−${usd(fee)}`} />
            <Row label="Insured shipping" value="Included" green />
            <Row label="Import duty" value="Payable by you" />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-apax-border2 pt-4">
            <span className="text-[13px] font-semibold text-apax-text">You receive</span>
            <span className="font-serif text-xl tabular-nums text-apax-gold">{usd(receive)}</span>
          </div>

          {gated ? (
            <div className="mt-5 border border-apax-goldDim bg-apax-goldBg px-3.5 py-3.5">
              <div className="text-[12px] font-medium text-apax-text">
                Redeeming is blocked until verification clears
              </div>
              <div className="mt-1.5 text-xs text-apax-muted">
                Physical delivery requires an approved identity and address check. Your metal
                stays allocated to you in the meantime.
              </div>
              <div className="mt-3 cursor-not-allowed bg-apax-line py-2.5 text-center text-[12px] font-semibold text-apax-dim">
                Burn tokens and redeem
              </div>
            </div>
          ) : (
            <div className="mt-5">
              {step === 1 ? (
                <PrimaryButton className="w-full py-2.5" onClick={next} disabled={quantity <= 0 || exceedsAvailable}>
                  Review redemption
                </PrimaryButton>
              ) : null}
              {step === 2 ? (
                <>
                  <button
                    onClick={authoriseBurn}
                    disabled={!ackBurn || submitting}
                    className="block w-full bg-apax-red py-2.5 text-center text-[12px] font-semibold text-apax-bg transition-colors hover:bg-[#C8796F] disabled:cursor-not-allowed disabled:bg-apax-line disabled:text-apax-dim"
                  >
                    {submitting ? 'Submitting…' : 'Burn tokens and redeem'}
                  </button>
                  <GhostButton className="mt-2 block w-full py-2 text-center" onClick={back}>
                    Go back
                  </GhostButton>
                </>
              ) : null}
              <div className="mt-3 font-mono text-[9.5px] leading-[1.7] text-apax-dim2">
                The 1% fee covers de-tokenisation, assay verification and insured shipping.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-apax-muted">{label}</span>
      <span className={`text-xs tabular-nums ${green ? 'text-apax-green' : 'text-apax-text2'}`}>{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between bg-apax-panel2 px-4 py-3.5">
      <span className="text-xs text-apax-muted">{label}</span>
      <span className="font-mono text-[11px] text-apax-text2">{value}</span>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  span2 = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  span2?: boolean;
}) {
  return (
    <label className={`block ${span2 ? 'col-span-2' : ''}`}>
      <div className="text-[11px] text-apax-muted">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-2.5 py-2 text-[13px] text-apax-text outline-none focus:border-apax-gold"
      />
    </label>
  );
}

function TrackRow({
  title,
  desc,
  tone,
  last,
}: {
  title: string;
  desc: string;
  tone: 'done' | 'active' | 'idle';
  last: boolean;
}) {
  const dotColor = tone === 'done' ? '#5E9C7B' : tone === 'active' ? '#C8A253' : 'transparent';
  return (
    <div className="grid grid-cols-[18px_1fr] gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 h-[9px] w-[9px] ${tone === 'active' ? 'animate-apaxPulse' : ''}`}
          style={{
            background: dotColor,
            border: tone === 'idle' ? '1px solid #2E343A' : 'none',
          }}
        />
        {!last ? <div className="w-px flex-1 bg-apax-border2" /> : null}
      </div>
      <div className={last ? '' : 'pb-[22px]'}>
        <div className="text-[13px]" style={{ color: tone === 'idle' ? '#5F666E' : '#E8E6E1' }}>
          {title}
        </div>
        <div
          className="mt-[3px] font-mono text-[10px]"
          style={{ color: tone === 'active' ? '#C8A253' : tone === 'done' ? '#5F666E' : '#4A5057' }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}
