import type {Metadata} from 'next';
import { Lora, Cinzel } from 'next/font/google';
import './globals.css'; // Global styles

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Sanatan Calendar - True Vedic Panchang',
  description: 'A highly precise and elegant Vedic calendar and daily Panchang built with modern celestial mechanics.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${lora.variable} ${cinzel.variable}`}>
      <body suppressHydrationWarning className="bg-sacred-dark text-stone-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}

