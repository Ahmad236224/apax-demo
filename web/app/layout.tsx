import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Spectral } from 'next/font/google';
import './globals.css';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-spectral',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'APAX — Allocated Metal Custody',
  description: 'Compliance-first tokenization of allocated gold, silver and platinum.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spectral.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-apax-bg font-sans text-[13px] leading-relaxed text-apax-text">
        {children}
      </body>
    </html>
  );
}
