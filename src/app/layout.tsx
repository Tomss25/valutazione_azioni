import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio Analyzer | FinTech Dashboard Q4 2025',
  description: 'Enterprise-grade financial analysis platform for stock evaluation and portfolio management',
  keywords: ['finance', 'portfolio', 'analysis', 'stocks', 'investment'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="light">
      <body className="font-sans min-h-screen bg-background">
        {/* Background effects - Light theme */}
        <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed top-1/2 right-0 w-[300px] h-[300px] bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
