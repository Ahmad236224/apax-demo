import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export function Panel({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`border border-apax-border bg-apax-panel ${className}`} {...props} />;
}

export function MonoLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`font-mono text-[9.5px] uppercase tracking-[.18em] text-apax-dim ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-apax-gold px-4 py-2.5 text-[12px] font-semibold text-apax-bg transition-colors hover:bg-apax-goldHover disabled:cursor-not-allowed disabled:bg-apax-line disabled:text-apax-dim ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`border border-apax-border2 px-4 py-2.5 text-[12px] text-apax-text2 transition-colors hover:border-apax-gold hover:text-apax-text disabled:cursor-not-allowed disabled:border-apax-border disabled:text-apax-dim ${className}`}
      {...props}
    />
  );
}

export function GhostButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`font-mono text-[10px] uppercase tracking-[.12em] text-apax-muted transition-colors hover:text-apax-text ${className}`}
      {...props}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mt-6 border border-apax-border bg-apax-panel px-10 py-16 text-center">
      <h2 className="font-serif text-2xl font-medium text-apax-text">{title}</h2>
      <p className="mx-auto mt-2.5 max-w-md text-[13px] text-apax-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center gap-2.5">{action}</div> : null}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-5 flex items-start gap-3 border border-apax-redBorder bg-apax-redBg px-4 py-3.5">
      <div className="mt-1.5 h-1.5 w-1.5 flex-none bg-apax-red" />
      <div>
        <div className="text-[13px] font-medium text-apax-text">We couldn&apos;t load this</div>
        <div className="mt-0.5 text-[12px] text-apax-muted">
          {message}
          {onRetry ? (
            <>
              {' '}
              <button onClick={onRetry} className="text-apax-gold hover:text-apax-goldHover">
                Try again
              </button>
              .
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-apaxPulse bg-apax-border ${className}`} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-apax-border pb-[18px]">
      <div>
        <div className="font-mono text-[9.5px] uppercase tracking-[.2em] text-apax-gold">
          {eyebrow}
        </div>
        <h1 className="mt-2.5 font-serif text-4xl font-medium tracking-tight text-apax-text">
          {title}
        </h1>
        {description ? (
          <p className="mt-2.5 max-w-xl text-[13px] text-apax-muted">{description}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}
