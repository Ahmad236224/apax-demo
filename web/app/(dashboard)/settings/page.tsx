'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { SectionHeading } from '@/components/ui/Primitives';
import type { KycStatus } from '@/lib/types';

const KYC_COPY: Record<KycStatus, { label: string; color: string; border: string }> = {
  approved: { label: 'Approved', color: '#5E9C7B', border: '#2E4A3B' },
  pending: { label: 'In review', color: '#C8A253', border: '#4A3C22' },
  unverified: { label: 'Not started', color: '#8B9199', border: '#2E343A' },
  rejected: { label: 'Rejected', color: '#B4685E', border: '#4A2E2A' },
};

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const kyc = KYC_COPY[user?.kycStatus ?? 'unverified'];

  async function saveProfile() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateProfile(fullName);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save your profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <SectionHeading eyebrow="Account" title="Settings" />

      <div className="mt-[22px] grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
          <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">Profile</div>
          <div className="mt-[18px] grid grid-cols-2 gap-3.5">
            <TextField label="Full name" value={fullName} onChange={setFullName} />
            <TextField label="Email" value={user?.email ?? ''} onChange={() => {}} disabled />
          </div>
          {saveError ? (
            <div className="mt-3 text-[12px] text-apax-red">{saveError}</div>
          ) : saved ? (
            <div className="mt-3 text-[12px] text-apax-green">Profile saved.</div>
          ) : null}
          <button
            onClick={saveProfile}
            disabled={saving || !fullName.trim()}
            className="mt-4 bg-apax-gold px-4 py-2 text-[12px] font-semibold text-apax-bg transition-colors hover:bg-apax-goldHover disabled:cursor-not-allowed disabled:bg-apax-line disabled:text-apax-dim"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>

          <div className="mt-[26px] border-t border-apax-border pt-5">
            <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
              Change password
            </div>
            <div className="mt-3.5 flex flex-col gap-3">
              <TextField
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                type="password"
              />
              <TextField label="New password" value={newPassword} onChange={setNewPassword} type="password" />
            </div>
            <button
              disabled
              title="Password changes aren't available in this build yet"
              className="mt-3.5 cursor-not-allowed border border-apax-border px-4 py-2 text-[12px] text-apax-dim"
            >
              Update password
            </button>
          </div>

          <div className="mt-[26px] border-t border-apax-border pt-5">
            <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
              Linked wallet
            </div>
            <div className="mt-3 flex items-center gap-2.5 border border-apax-border bg-apax-panel2 px-3.5 py-2.5">
              <div className="flex-1 truncate font-mono text-[11px] text-apax-text2">
                {user?.walletAddress ?? 'No wallet linked yet'}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[.12em] text-apax-dim2">
                Read only
              </div>
            </div>
            <div className="mt-2 text-xs text-apax-muted">
              Set once at onboarding. To change it, contact your relationship manager — tokens can
              only be issued to a verified address.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
                Verification
              </div>
              <div
                className="flex items-center gap-1.5 border px-2 py-[3px]"
                style={{ borderColor: kyc.border }}
              >
                <div className="h-[5px] w-[5px] rounded-full" style={{ background: kyc.color }} />
                <div
                  className="font-mono text-[9px] uppercase tracking-[.12em]"
                  style={{ color: kyc.color }}
                >
                  {kyc.label}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-px border border-apax-border bg-apax-border">
              <VerifyRow label="Identity document" ok={user?.kycStatus === 'approved'} />
              <VerifyRow label="Proof of address" ok={user?.kycStatus === 'approved'} />
              <VerifyRow label="Source of funds" ok={user?.kycStatus === 'approved'} note={user?.kycStatus === 'approved' ? undefined : 'Awaiting review'} />
            </div>
            <a
              href="/verify"
              className="mt-3.5 block w-fit border border-apax-border2 px-4 py-2 text-[12px] text-apax-text2 hover:border-apax-gold hover:text-apax-text"
            >
              Manage documents
            </a>
          </div>

          <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
            <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
              Notifications
            </div>
            <div className="mt-4 flex flex-col gap-3.5">
              <NotifyRow title="Reserve attestations" desc="Every time a new audit is published" defaultChecked />
              <NotifyRow title="Mint and redemption receipts" desc="Confirmation with bar serials" defaultChecked />
              <NotifyRow title="Monthly statement" desc="Holdings, obligations and movements" />
            </div>
          </div>

          <div className="border border-apax-border bg-apax-panel px-[26px] py-6">
            <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">Sessions</div>
            <div className="mt-3.5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[13px] text-apax-text">This device</div>
                  <div className="mt-1 font-mono text-[9.5px] text-apax-dim">Active now</div>
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[.12em] text-apax-green">
                  Current
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[11px] text-apax-muted">{label}</div>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full border border-apax-border2 bg-transparent px-2.5 py-2 text-[13px] text-apax-text outline-none disabled:text-apax-dim focus:border-apax-gold"
      />
    </label>
  );
}

function VerifyRow({ label, ok, note }: { label: string; ok: boolean; note?: string }) {
  return (
    <div className="flex justify-between bg-apax-panel2 px-3.5 py-3">
      <span className="text-xs text-apax-text2">{label}</span>
      <span
        className="font-mono text-[10px]"
        style={{ color: ok ? '#5E9C7B' : '#C8A253' }}
      >
        {ok ? 'Verified' : note ?? 'Pending'}
      </span>
    </div>
  );
}

function NotifyRow({ title, desc, defaultChecked = false }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 accent-apax-gold" />
      <span>
        <span className="block text-[13px] text-apax-text">{title}</span>
        <span className="mt-0.5 block text-xs text-apax-muted">{desc}</span>
      </span>
    </label>
  );
}
