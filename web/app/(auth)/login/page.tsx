'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { PrimaryButton } from '@/components/ui/Primitives';

export default function LoginPage() {
  const router = useRouter();
  const { login, status, error } = useAuthStore();
  const [email, setEmail] = useState('n.rasheed@meridianfamily.ae');
  const [password, setPassword] = useState('');
  const loading = status === 'loading';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch {
      // error is already surfaced via the store
    }
  }

  return (
    <div className="grid grid-cols-1 gap-px border border-apax-border bg-apax-border md:grid-cols-2">
      <div className="bg-apax-panel px-8 py-10 sm:px-11 sm:py-11">
        <div className="font-serif text-[22px] font-semibold tracking-[.18em] text-apax-text">
          APAX
        </div>
        <h2 className="mt-8 font-serif text-[30px] font-medium text-apax-text">
          Sign in to your vault
        </h2>

        {error ? (
          <div className="mt-[22px] border border-apax-redBorder bg-apax-redBg px-[15px] py-3.5">
            <div className="text-[12px] font-medium text-apax-text">That email and password don&apos;t match</div>
            <div className="mt-1 text-[12px] text-apax-muted">{error}</div>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-[22px] flex flex-col gap-4">
          <label className="block">
            <div className="text-[11px] text-apax-muted">Email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
            />
          </label>
          <label className="block">
            <div className="flex justify-between">
              <span className="text-[11px] text-apax-muted">Password</span>
              <Link href="/reset-password" className="text-[11px] text-apax-gold hover:text-apax-goldHover">
                Forgot password
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
            />
          </label>
          <PrimaryButton type="submit" disabled={loading} className="mt-1.5 flex w-full items-center justify-center gap-2.5 py-3">
            {loading ? (
              <>
                <span className="h-1.5 w-1.5 animate-apaxPulse bg-apax-bg" />
                Signing in
              </>
            ) : (
              'Sign in'
            )}
          </PrimaryButton>
        </form>

        <div className="mt-[18px] text-[12px] text-apax-muted">
          No account yet?{' '}
          <Link href="/register" className="text-apax-gold hover:text-apax-goldHover">
            Open a vault account
          </Link>
          .
        </div>
      </div>

      <div className="flex flex-col justify-center bg-apax-panel3 px-8 py-10 sm:px-11 sm:py-11">
        <div className="font-mono text-[9.5px] uppercase tracking-[.18em] text-apax-gold">
          Attested this quarter
        </div>
        <div className="mt-[22px] flex flex-col gap-[18px]">
          {[
            { label: 'Gold in vault', value: '15.68 kg', color: '#C8A253' },
            { label: 'Silver in vault', value: '89.24 kg', color: '#A9B2BA' },
            { label: 'Platinum in vault', value: '4.52 kg', color: '#DCE3E8' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between border-b border-apax-border pb-3.5"
            >
              <span className="text-[13px] text-apax-text2">{row.label}</span>
              <span className="font-serif text-[22px] tabular-nums" style={{ color: row.color }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-[12px] leading-[1.7] text-apax-muted">
          Counted by Kellerman &amp; Roth AG and reconciled against circulating supply. No
          leverage, no lending, no yield.
        </div>
      </div>
    </div>
  );
}
