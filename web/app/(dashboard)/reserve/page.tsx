'use client';

import { useReserve } from '@/lib/hooks';
import { METAL_REFERENCE } from '@/lib/metals';
import { formatDate, num } from '@/lib/format';
import { EmptyState, ErrorBanner, SkeletonBlock } from '@/components/ui/Primitives';

export default function ReservePage() {
  const { reserves, audits, custodians, status, error, reload } = useReserve();

  const latestAudit = audits[0];
  const totalTokens = reserves.reduce((sum, r) => sum + r.mintedSupplyGrams, 0);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-apax-border pb-[18px]">
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[.2em] text-apax-gold">
            Certification hub
          </div>
          <h1 className="mt-2.5 font-serif text-4xl font-medium text-apax-text">Proof of reserve</h1>
        </div>
        {latestAudit ? (
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim">
              Last attestation
            </div>
            <div className="mt-1.5 text-[13px] text-apax-text2">
              {formatDate(latestAudit.issuedAt)} · {latestAudit.auditor}
            </div>
          </div>
        ) : null}
      </div>

      {status === 'loading' ? (
        <div className="mt-[22px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-apax-border bg-apax-panel px-6 py-[22px]">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-5 h-8 w-32" />
            </div>
          ))}
        </div>
      ) : status === 'error' ? (
        <div className="mt-[22px]">
          <ErrorBanner message={error ?? 'Could not load reserve data.'} onRetry={reload} />
        </div>
      ) : reserves.length === 0 ? (
        <EmptyState title="No attestations published yet" description="Reserve attestations will appear here once the custodian publishes the first audit." />
      ) : (
        <>
          <div className="mt-[22px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reserves.map((r) => {
              const ref = METAL_REFERENCE[r.asset];
              const ratio = (r.auditedReserveGrams / r.mintedSupplyGrams) * 100;
              const surplusKg = (r.auditedReserveGrams - r.mintedSupplyGrams) / 1000;
              const matched = r.status === 'matched';
              return (
                <div key={r.id} className="border border-apax-border bg-apax-panel px-6 py-[22px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-[7px] w-[7px]" style={{ background: ref.color }} />
                      <div className="text-sm font-medium text-apax-text">{ref.label}</div>
                    </div>
                    <div
                      className="border px-2 py-[3px] font-mono text-[9px] uppercase tracking-[.12em]"
                      style={{
                        borderColor: matched ? '#2E4A3B' : '#4A2E2A',
                        color: matched ? '#5E9C7B' : '#B4685E',
                      }}
                    >
                      {matched ? 'Matched' : 'Discrepancy'}
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[.14em] text-apax-dim">
                        In vault
                      </div>
                      <div className="mt-1.5 font-serif text-[26px] tabular-nums text-apax-text">
                        {num(r.auditedReserveGrams / 1000, 2)} kg
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[9px] uppercase tracking-[.14em] text-apax-dim">
                        Tokenised
                      </div>
                      <div className="mt-1.5 text-[17px] tabular-nums text-apax-text2">
                        {num(r.mintedSupplyGrams / 1000, 2)} kg
                      </div>
                    </div>
                  </div>
                  <div className="mt-[18px] h-1 bg-apax-border">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(100, (r.mintedSupplyGrams / r.auditedReserveGrams) * 100).toFixed(2)}%`,
                        background: ref.color,
                      }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between">
                    <div className="font-mono text-[9.5px] text-apax-dim">
                      {surplusKg >= 0 ? '+' : '−'}
                      {num(Math.abs(surplusKg), 3)} kg surplus
                    </div>
                    <div className="font-mono text-[11px] tabular-nums text-apax-green">
                      {ratio.toFixed(2)}% backed
                    </div>
                  </div>
                  <div className="mt-4 border-t border-apax-border pt-3.5 font-mono text-[9.5px] text-apax-dim2">
                    Period end {formatDate(r.periodEnd)} · {r.auditor}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="border border-apax-border bg-apax-panel">
              <div className="flex items-baseline justify-between border-b border-apax-border px-[22px] py-[18px]">
                <div className="font-mono text-[9.5px] uppercase tracking-[.18em] text-apax-dim">
                  Attestations and certifications
                </div>
                <div className="font-mono text-[9.5px] text-apax-dim2">{audits.length} documents</div>
              </div>
              {audits.length === 0 ? (
                <div className="px-[22px] py-6 text-[13px] text-apax-muted">No documents published yet.</div>
              ) : (
                audits.map((a) => (
                  <div
                    key={a.id}
                    className="grid grid-cols-[1.3fr_1.2fr_1fr_auto] items-center gap-4 border-b border-apax-line px-[22px] py-4 last:border-b-0"
                  >
                    <div>
                      <div className="text-[13px] text-apax-text">{a.scope}</div>
                      <div className="mt-1 font-mono text-[9.5px] text-apax-gold">{a.ref}</div>
                    </div>
                    <div>
                      <div className="text-xs text-apax-text2">{a.auditor}</div>
                      <div className="mt-1 font-mono text-[9.5px] text-apax-dim">{a.periodLabel}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[.1em] text-apax-muted">
                        {a.statusLabel}
                      </div>
                      <div className="mt-1 font-mono text-[9.5px] text-apax-dim2">
                        Issued {formatDate(a.issuedAt)}
                      </div>
                    </div>
                    <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[.1em] text-apax-gold">
                      Download ↓
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="border border-apax-border bg-apax-panel px-6 py-[22px]">
                <div className="font-mono text-[9.5px] uppercase tracking-[.18em] text-apax-dim">
                  Circulating supply
                </div>
                <div className="mt-3.5 font-serif text-4xl font-medium tabular-nums text-apax-text">
                  {Math.round(totalTokens).toLocaleString('en-US')}
                </div>
                <div className="mt-1.5 font-mono text-[9.5px] text-apax-dim">
                  tokens across three metals · one token = one gram
                </div>
                <div className="mt-[18px] flex flex-col gap-2.5 border-t border-apax-border pt-4">
                  <Row label="Contract" value="0x8f4e…3a2b" gold />
                  <Row label="Standard" value="ERC-3643" />
                  <Row label="Reserve oracle" value="Updated 5 min ago" />
                </div>
              </div>

              {custodians.map((c) => (
                <div key={c.id} className="border border-apax-border bg-apax-panel px-6 py-5">
                  <div className="font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim">
                    Custodian
                  </div>
                  <div className="mt-2 font-serif text-[19px] text-apax-text">{c.name}</div>
                  <div className="mt-1 font-mono text-[9.5px] text-apax-muted">
                    {c.city} · {c.licence}
                  </div>
                  <div className="mt-3.5 flex flex-col gap-2 border-t border-apax-border pt-3">
                    <Row label="Holds" value={c.holds} />
                    <Row label="Basis" value={c.segregation} />
                    <Row label="Insurer" value={c.insurer} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Row({ label, value, gold = false }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-apax-muted">{label}</span>
      <span className={`text-right font-mono text-[10.5px] ${gold ? 'text-apax-gold' : 'text-apax-text2'}`}>
        {value}
      </span>
    </div>
  );
}
