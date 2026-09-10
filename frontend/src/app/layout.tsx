import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';

export const metadata: Metadata = {
  title: 'Spend Task Manager | Aplikasi Pengelola Project & Task',
  description:
    'Aplikasi web manajemen project dan task lengkap dengan pencarian, filter status & prioritas, serta relasi database relasional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <ToastProvider />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4">
            Spend Group Web Developer Technical Test &bull; Dibangun dengan Next.js & Express
          </div>
        </footer>
      </body>
    </html>
  );
}
