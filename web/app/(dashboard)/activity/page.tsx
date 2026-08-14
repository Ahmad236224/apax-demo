'use client';

import { useActivity } from '@/lib/hooks';
import { useActivityFilterStore } from '@/lib/store/ui';
import { METAL_REFERENCE, TRANSACTION_TYPE_LABEL, STATUS_COLOR } from '@/lib/metals';
import { usd, num, formatDate } from '@/lib/format';
import { EmptyState, ErrorBanner, SectionHeading, SkeletonBlock } from '@/components/ui/Primitives';
import type { MetalKey, TransactionStatus, TransactionType } from '@/lib/types';

export default function ActivityPage() {
  const { asset, type, status: statusFilter, setAsset, setType, setStatus, clear } = useActivityFilterStore();
  const { transactions, total, totalPages, page, setPage, status, error, reload } = useActivity();

  return (
    <section>
      <SectionHeading eyebrow="Ledger" title="Activity" />

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <Field label="Asset">
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value as MetalKey | 'all')}
            className="min-w-[130px] cursor-pointer border border-apax-border2 bg-apax-panel px-2.5 py-[7px] text-[12px] text-apax-text2 outline-none"
          >
            <option value="all">All metals</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
          </select>
        </Field>
        <Field label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType | 'all')}
            className="min-w-[150px] cursor-pointer border border-apax-border2 bg-apax-panel px-2.5 py-[7px] text-[12px] text-apax-text2 outline-none"
          >
            <option value="all">All types</option>
            <option value="mint">Mint</option>
            <option value="burn">Burn</option>
            <option value="transfer">Transfer</option>
            <option value="redemption">Redemption</option>
            <option value="deposit">Custody deposit</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value as TransactionStatus | 'all')}
            className="min-w-[130px] cursor-pointer border border-apax-border2 bg-apax-panel px-2.5 py-[7px] text-[12px] text-apax-text2 outline-none"
          >
            <option value="all">Any status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
        <button
          onClick={clear}
          className="border-none bg-transparent px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em] text-apax-muted hover:text-apax-text"
        >
          Clear filters
        </button>
        <div className="ml-auto font-mono text-[10px] text-apax-dim">
          {status === 'success' || status === 'empty' ? `${total} entries` : ''}
        </div>
      </div>

      <div className="mt-4 border border-apax-border bg-apax-panel">
        <div className="grid grid-cols-[1.1fr_.8fr_.9fr_.9fr_.8fr_1.1fr] gap-3.5 border-b border-apax-border px-[22px] py-3">
          {['Type', 'Asset', 'Quantity', 'Value', 'Status', 'Reference · time'].map((h, i) => (
            <div
              key={h}
              className={`font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim2 ${i >= 2 ? 'text-right' : ''}`}
            >
              {h}
            </div>
          ))}
        </div>

        {status === 'loading' ? (
          <div className="flex flex-col gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-[22px] py-3.5">
                <SkeletonBlock className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : status === 'error' ? (
          <div className="px-[22px] py-6">
            <ErrorBanner message={error ?? 'Could not load the activity feed.'} onRetry={reload} />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No matching activity"
            description="No transactions match these filters yet. Try widening the filters or clearing them."
            action={
              <button
                onClick={clear}
                className="border border-apax-border2 px-4 py-2 text-[12px] text-apax-text2 hover:border-apax-gold hover:text-apax-text"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          transactions.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1.1fr_.8fr_.9fr_.9fr_.8fr_1.1fr] items-center gap-3.5 border-b border-apax-line px-[22px] py-3.5 last:border-b-0"
            >
              <div className="text-[13px] text-apax-text">{TRANSACTION_TYPE_LABEL[row.type]}</div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5" style={{ background: METAL_REFERENCE[row.asset].color }} />
                <div className="text-[12px] text-apax-text2">{METAL_REFERENCE[row.asset].label}</div>
              </div>
              <div className="text-right font-mono text-[11px] tabular-nums text-apax-text2">
                {num(row.quantityGrams, 3)} g
              </div>
              <div className="text-right text-xs tabular-nums text-apax-text2">{usd(row.valueUsd)}</div>
              <div className="flex items-center justify-end gap-1.5">
                <div className="h-[5px] w-[5px] rounded-full" style={{ background: STATUS_COLOR[row.status] }} />
                <div className="font-mono text-[9.5px] uppercase tracking-[.1em] text-apax-muted">
                  {row.status}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10.5px] text-apax-gold">{row.reference}</div>
                <div className="font-mono text-[9.5px] text-apax-dim2">{formatDate(row.createdAt)}</div>
              </div>
            </div>
          ))
        )}

        {status === 'success' && totalPages > 1 ? (
          <div className="flex items-center justify-between px-[22px] py-3.5">
            <div className="font-mono text-[10px] text-apax-dim">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="border border-apax-border px-[11px] py-[5px] font-mono text-[10px] text-apax-dim2 disabled:cursor-not-allowed hover:enabled:border-apax-gold hover:enabled:text-apax-text"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="border px-[11px] py-[5px] font-mono text-[10px]"
                  style={{
                    borderColor: p === page ? '#C8A253' : '#2E343A',
                    color: p === page ? '#C8A253' : '#8B9199',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="border border-apax-border2 px-[11px] py-[5px] font-mono text-[10px] text-apax-muted disabled:cursor-not-allowed disabled:border-apax-border disabled:text-apax-dim2 hover:enabled:border-apax-gold hover:enabled:text-apax-text"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[9px] uppercase tracking-[.16em] text-apax-dim">{label}</div>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
