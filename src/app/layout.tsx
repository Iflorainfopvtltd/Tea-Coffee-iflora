import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tea-Coffee | Daily Counter & Tracker',
  description: 'Smart Tea & Coffee daily counting and management web app with real-time statistics',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full bg-[#06080e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
