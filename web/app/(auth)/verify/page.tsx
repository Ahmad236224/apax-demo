'use client';

export default function VerifyPage() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="border border-apax-border bg-apax-panel px-7 py-8 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 w-1.5 animate-apaxPulse bg-apax-gold" />
          <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-gold">
            Status · pending review
          </div>
        </div>
        <h2 className="mt-4 font-serif text-[30px] font-medium text-apax-text">
          Two documents to go
        </h2>
        <p className="mt-2.5 max-w-lg text-[13px] text-apax-muted">
          Custody regulation requires us to know who owns the metal before any bullion is
          allocated. Until this clears you can view reserves and audits, but buying and redeeming
          stay closed.
        </p>

        <div className="mt-6 flex gap-0.5">
          {[
            { label: '01 · Submitted', desc: 'Email confirmed', tone: 'done' },
            { label: '02 · In review', desc: 'Identity documents', tone: 'active' },
            { label: '03 · Waiting', desc: 'Compliance approval', tone: 'idle' },
          ].map((step) => (
            <div
              key={step.label}
              className="flex-1 border px-3.5 py-3"
              style={{
                borderColor: step.tone === 'done' ? '#2E4A3B' : step.tone === 'active' ? '#4A3C22' : '#23272C',
                background: step.tone === 'done' ? '#141A17' : step.tone === 'active' ? '#191712' : 'transparent',
              }}
            >
              <div
                className="font-mono text-[9px] uppercase tracking-[.12em]"
                style={{ color: step.tone === 'done' ? '#5E9C7B' : step.tone === 'active' ? '#C8A253' : '#4A5057' }}
              >
                {step.label}
              </div>
              <div className="mt-1.5 text-[12px] text-apax-text2">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border border-dashed border-apax-border2 bg-apax-panel3 px-8 py-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[.14em] text-apax-gold">
            Drop files here
          </div>
          <div className="mt-2.5 text-[13px] text-apax-text2">
            Passport or national ID, plus proof of address dated within 3 months
          </div>
          <div className="mt-1.5 font-mono text-[9.5px] text-apax-dim">
            PDF, JPG or PNG · up to 10 MB each
          </div>
          <button
            type="button"
            className="mt-4 border border-apax-border2 px-4 py-2 text-[12px] text-apax-text2 hover:border-apax-gold"
          >
            Choose files
          </button>
        </div>
      </div>

      <div className="border border-apax-border bg-apax-panel px-6 py-6 sm:px-7">
        <div className="font-mono text-[9.5px] uppercase tracking-[.16em] text-apax-dim">
          What happens next
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {[
            { n: '01', title: 'We check your documents', desc: 'A compliance officer reviews them by hand. Usually within one business day.' },
            { n: '02', title: 'You get an email either way', desc: 'If something is unreadable or out of date we say exactly what to send instead.' },
            { n: '03', title: 'Buying and redeeming open', desc: 'Your account is cleared to transact at the same moment.' },
          ].map((s) => (
            <div key={s.n} className="flex gap-3">
              <div className="font-mono text-[10px] text-apax-gold">{s.n}</div>
              <div>
                <div className="text-[13px] text-apax-text">{s.title}</div>
                <div className="mt-1 text-[12px] text-apax-muted">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-apax-border pt-4 text-[12px] text-apax-muted">
          Documents are held encrypted by our KYC processor and are never written on-chain.
        </div>
      </div>
    </div>
  );
}
