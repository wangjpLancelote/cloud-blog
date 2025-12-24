import localFont from 'next/font/local';

export const geist = localFont({
  src: [
    {
      path: '../../../public/fonts/geist/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/geist/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
});

export const geistMono = localFont({
  src: [
    {
      path: '../../../public/fonts/geist/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/geist/GeistMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
});

