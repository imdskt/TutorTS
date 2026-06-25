import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TutorTS | AI Socratic Tutor',
  description: 'Adaptive AI tutor powered by Qwen Cloud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 min-h-screen font-sans antialiased selection:bg-neutral-200">
        {children}
      </body>
    </html>
  );
}
