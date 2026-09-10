import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';

export const metadata: Metadata = {
  title: 'Spend Task Manager | Task & Project Management App',
  description:
    'A full-stack task management web application with projects, tasks, search, filters, and relational data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <ToastProvider />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4">
            Spend Group Web Developer Technical Test &bull; Built with Next.js & Express
          </div>
        </footer>
      </body>
    </html>
  );
}
