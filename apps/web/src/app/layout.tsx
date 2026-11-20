import type { Metadata } from 'next';
import { Archivo, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['500', '600', '700', '800', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'E-fitness | Elite Athletic Performance & 3D Training Stage',
  description:
    'E-fitness merges real-time athletic periodization, interactive 3D training showcases, and exercise physiology coaching to transform your physical potential.',
  openGraph: {
    title: 'E-fitness | Elite Athletic Performance & 3D Training Stage',
    description:
      'E-fitness merges real-time athletic periodization, interactive 3D training showcases, and exercise physiology coaching to transform your physical potential.',
    type: 'website',
    images: ['/images/hero_athlete_training_1790903677189.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-fitness | Elite Athletic Performance & 3D Training Stage',
    description:
      'E-fitness merges real-time athletic periodization, interactive 3D training showcases, and exercise physiology coaching to transform your physical potential.',
    images: ['/images/hero_athlete_training_1790903677189.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'E-fitness',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'E-fitness merges real-time athletic periodization, interactive 3D training showcases, and exercise physiology coaching to transform your physical potential.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${dmSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-zinc-100 antialiased font-body selection:bg-neon selection:text-bg">
        {children}
      </body>
    </html>
  );
}
