'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function QRCodeScanner({
  onScanned
}: {
  onScanned?: (qrCode: string) => void;
}) {
  const [qrText, setQrText] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);

  const handleScanFromCamera = async () => {
    if (scanning) return;
    setScanning(true);

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setQrText(decodedText);
          alert('✅ QR berhasil dibaca dari kamera!');
          scanner.stop();
          setScanning(false);
        },
        (err) => {
          console.log('Scanning error:', err);
        }
      );
    } catch (e) {
      alert('❌ Gagal mengakses kamera.');
      setScanning(false);
    }
  };

  const handleScanFromFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const scanner = new Html5Qrcode('qr-reader');
    try {
      const result = await scanner.scanFile(file, true);
      //   setQrText(result);
      if (onScanned) {
        onScanned(result);
      }
      toast.success('✅ QR berhasil dibaca dari gambar!');
    } catch (err) {
      toast.error('❌ Gagal membaca QR dari gambar.');
      console.error(err);
    } finally {
      await scanner.clear();
      const el = document.getElementById('qr-reader');
      if (el) el.innerHTML = '';
      e.target.value = ''; // reset agar bisa pilih file yang sama lagi
    }
  };

  return (
    <div className=''>
      {/* <label className='block font-semibold'>Isi dari QR Code:</label>
      <input
        type='text'
        value={qrText}
        onChange={(e) => setQrText(e.target.value)}
        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      /> */}

      <div className='space-y-2'>
        {/* <button onClick={handleScanFromCamera} className=''>
          Scan dari Kamera
        </button> */}

        <button onClick={() => fileInputRef.current?.click()} className=''>
          Pilih Gambar
        </button>

        {/* input file tersembunyi */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleScanFromFile}
          className='hidden'
        />
      </div>

      {/* Tempat scanner kamera saja */}
      <div
        id='qr-reader'
        className='mt-4'
        style={{ width: '0px', height: '0px', visibility: 'hidden' }}
      ></div>
    </div>
  );
}
