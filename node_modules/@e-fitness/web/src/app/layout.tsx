import { Sora, DM_Sans } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata = {
  title: 'E-fitness | AI-Powered Elite Coaching',
  description: 'E-fitness merges cutting-edge neural analysis with elite coaching to transform your physical potential.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="bg-bg text-zinc-100 antialiased font-body selection:bg-neon selection:text-black">
        {children}
      </body>
    </html>
  );
}
