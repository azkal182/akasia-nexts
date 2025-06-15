'use client';

import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function BarcodePage({ slug }: { slug: string }) {
  if (typeof slug !== 'string') return null;

  return (
    <div className='flex items-center justify-center h-screen'>
      <QRCodeSVG
        value={decodeURIComponent(slug)}
        size={256}
        bgColor='#ffffff'
        fgColor='#000000'
        level='H'
        includeMargin={true}
      />
    </div>
  );
}
