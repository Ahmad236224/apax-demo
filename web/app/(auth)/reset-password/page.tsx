'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { PrimaryButton } from '@/components/ui/Primitives';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // No password-reset endpoint exists yet on the backend (out of scope for
    // this build) — this simulates the "link sent" state the UI needs.
    setSent(true);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      <div className="border border-apax-border bg-apax-panel px-8 py-9 sm:px-10">
        <h2 className="font-serif text-2xl font-medium text-apax-text">Reset your password</h2>
        <p className="mt-2.5 text-[13px] text-apax-muted">
          Enter the email on your account. We send a single-use link that expires in 30 minutes.
        </p>
        {sent ? (
          <div className="mt-5 border border-apax-greenBorder bg-apax-greenBg px-4 py-3 text-[13px] text-apax-text">
            If an account exists for {email}, a reset link is on its way.
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="mt-5 block">
              <div className="text-[11px] text-apax-muted">Email</div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
              />
            </label>
            <PrimaryButton type="submit" className="mt-5 w-full py-2.5">
              Send reset link
            </PrimaryButton>
          </form>
        )}
        <div className="mt-3.5 text-[12px] text-apax-muted">
          <Link href="/login" className="hover:text-apax-text">
            Back to sign in
          </Link>
        </div>
      </div>

      <div className="border border-apax-border bg-apax-panel px-8 py-9 sm:px-10">
        <h2 className="font-serif text-2xl font-medium text-apax-text">Set a new password</h2>
        <p className="mt-2.5 text-[13px] text-apax-muted">
          Signing in again also ends every other session on your account.
        </p>
        <div className="mt-5 flex flex-col gap-3.5">
          <label className="block">
            <div className="text-[11px] text-apax-muted">New password</div>
            <input
              type="password"
              className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
            />
          </label>
          <label className="block">
            <div className="text-[11px] text-apax-muted">Confirm new password</div>
            <input
              type="password"
              className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-3 py-2.5 text-[13px] text-apax-text outline-none focus:border-apax-gold"
            />
          </label>
        </div>
        <PrimaryButton className="mt-5 w-full py-2.5">Save new password</PrimaryButton>
      </div>
    </div>
  );
}
