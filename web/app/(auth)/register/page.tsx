'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { PrimaryButton } from '@/components/ui/Primitives';

export default function RegisterPage() {
  const router = useRouter();
  const { register, status, error } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const loading = status === 'loading';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    if (!accepted) {
      setLocalError('You must accept the custody terms to continue');
      return;
    }
    try {
      await register(fullName, email, password);
      router.push('/');
    } catch {
      // surfaced via store `error`
    }
  }

  return (
    <div className="mx-auto max-w-[560px] border border-apax-border bg-apax-panel px-8 py-9 sm:px-11 sm:py-10">
      <h2 className="font-serif text-[30px] font-medium text-apax-text">Open a vault account</h2>
      <p className="mt-2.5 text-[13px] text-apax-muted">
        You can browse reserves straight away. Buying and redeeming open once your identity check
        clears, usually within one business day.
      </p>

      {localError || error ? (
        <div className="mt-5 border border-apax-redBorder bg-apax-redBg px-4 py-3 text-[12px] text-apax-text">
          {localError ?? error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="block">
          <div className="text-[11px] text-apax-muted">Full name</div>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
          />
        </label>
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
          <div className="text-[11px] text-apax-muted">Password</div>
          <input
            type="password"
            required
            minLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
          />
          <div className="mt-1.5 font-mono text-[9.5px] text-apax-dim">
            At least 12 characters, one number, one symbol
          </div>
        </label>
        <label className="block">
          <div className="text-[11px] text-apax-muted">Confirm password</div>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
          />
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 accent-apax-gold"
          />
          <span className="text-[12px] text-apax-text2">
            I accept the custody terms and confirm I am buying metal for myself, not on behalf of
            another party.
          </span>
        </label>
        <PrimaryButton type="submit" disabled={loading} className="mt-1.5 w-full py-3">
          {loading ? 'Opening account…' : 'Open account'}
        </PrimaryButton>
      </form>

      <div className="mt-4 text-[12px] text-apax-muted">
        Already have one?{' '}
        <Link href="/login" className="text-apax-gold hover:text-apax-goldHover">
          Sign in
        </Link>
        .
      </div>
    </div>
  );
}
