'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from './api';
import type {
  AuditDocument,
  Custodian,
  Holding,
  ReserveAttestation,
  Transaction,
} from './types';
import { useActivityFilterStore } from './store/ui';

type AsyncStatus = 'loading' | 'success' | 'error' | 'empty';

/**
 * Task B answer, implemented: a small fetch hook per resource instead of one
 * big "dashboard" fetch. Each hook owns its own loading/error/empty state so
 * a screen can render skeletons, a retry banner, or an empty-state card
 * without the rest of the page waiting on it.
 */
export function useHoldings() {
  const [data, setData] = useState<Holding[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await apiFetch<{ holdings: Holding[] }>('/api/holdings');
      setData(res.holdings);
      setStatus(res.holdings.length === 0 ? 'empty' : 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load holdings');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { holdings: data, status, error, reload };
}

export function useActivity() {
  const { asset, type, status: statusFilter, page, setPage } = useActivityFilterStore();
  const [data, setData] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    const params = new URLSearchParams({
      asset,
      type,
      status: statusFilter,
      page: String(page),
      pageSize: '10',
    });
    try {
      const res = await apiFetch<{
        transactions: Transaction[];
        total: number;
        totalPages: number;
      }>(`/api/activity?${params.toString()}`);
      setData(res.transactions);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setStatus(res.transactions.length === 0 ? 'empty' : 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity');
      setStatus('error');
    }
  }, [asset, type, statusFilter, page]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { transactions: data, total, totalPages, status, error, reload, page, setPage };
}

export function useReserve() {
  const [reserves, setReserves] = useState<ReserveAttestation[]>([]);
  const [audits, setAudits] = useState<AuditDocument[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await apiFetch<{
        reserves: ReserveAttestation[];
        audits: AuditDocument[];
        custodians: Custodian[];
      }>('/api/reserve');
      setReserves(res.reserves);
      setAudits(res.audits);
      setCustodians(res.custodians);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reserve data');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { reserves, audits, custodians, status, error, reload };
}
