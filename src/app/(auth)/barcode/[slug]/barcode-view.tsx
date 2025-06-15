'use client';

import { CarResponse, getCarByBarcode } from '@/actions/car';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export default function BarcodePage({ slug }: { slug: string }) {
  const [car, setCar] = useState<CarResponse | null>(null);

  const getData = async () => {
    const data = await getCarByBarcode(slug);
    setCar(data);
  };
  useEffect(() => {
    getData();
  }, [slug]);
  if (typeof slug !== 'string') return null;

  return (
    <div className='flex items-center justify-center h-screen bg-white'>
      {/* <div className='text-black'>as</div> */}
      <div className='bg-white p-4'>
        {car && (
          <h1 className='text-black text-center p-2 font-semibold'>
            {car?.licensePlate ?? 'Tidak ada plat nomor'}
          </h1>
        )}
        <QRCodeSVG
          title='test'
          value={decodeURIComponent(slug)}
          size={256}
          bgColor='#ffffff'
          fgColor='#000000'
          level='H'
          includeMargin={false}
        />
      </div>
    </div>
  );
}
