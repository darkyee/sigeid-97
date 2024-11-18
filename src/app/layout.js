import 'bootstrap/dist/css/bootstrap.min.css'; // importa el css de bootstrap
import 'bootstrap-icons/font/bootstrap-icons.min.css' // importa los iconos de bootstrap
import '@/assets/styles/global.css';

import Script from 'next/script';

// Importa la fuente de google
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SIGEID',
  description: 'Sistema de Gestión de Instalaciones Deportivas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/datatables.min.css" />
      </head>
      <body className={inter.className}>
        {children}

        {/* Importa los scripts de bootstrap */}
        <Script
          src="/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/datatables.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/moment-with-locales.min.js"
          strategy="beforeInteractive"
        />

        <Script src="/scripts.js" strategy="beforeInteractive" />

      </body>
    </html>
  );
}
