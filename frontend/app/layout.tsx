import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import ClientOnly from '../components/ClientOnly';
import './globals.css';

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description: 'Watch movies online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientOnly>
          <AuthProvider>{children}</AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
