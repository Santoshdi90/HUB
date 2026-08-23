import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rani Channamma Hitech Nursery — Inchageri, Vijayapura',
  description: 'Karnataka premier hi-tech plant nursery supplying commercial forestry teak, sandalwood, tissue cultured bamboo, dragon fruit, avocado, and high yield fruit saplings from Horti Road, Inchageri, Vijayapura.',
  keywords: 'nursery, plant nursery, vijayapura, inchageri, teak saplings, red sandalwood, dragon fruit, avocado, tissue culture bamboo, rani channamma nursery, horti road',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-warm-50 text-gray-900 antialiased selection:bg-emerald-200 selection:text-forest-900">
        {children}
      </body>
    </html>
  );
}
