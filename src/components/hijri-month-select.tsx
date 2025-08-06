'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import UmmalquraCalendar from 'ummalqura-calendar';

type HijriOption = {
  label: string;
  value: string;
};

type Props = {
  searchParams: { startHijri?: string };
};

const monthNames = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awwal',
  'Jumadil Akhir',
  'Rajab',
  "Sya'ban",
  'Ramadhan',
  'Syawal',
  'Zulkaidah',
  'Zulhijjah'
];

export default function HijriMonthSelect({ searchParams }: Props) {
  const router = useRouter();
  const [selectedHijri, setSelectedHijri] = useState('');

  // Fungsi untuk generate opsi dari Hijriyah (1445 - 1450)
  const generateHijriOptions = (): HijriOption[] => {
    const options: HijriOption[] = [];
    for (let year = 1445; year <= 1450; year++) {
      for (let month = 1; month <= 12; month++) {
        const label = `${monthNames[month - 1]} ${year}`;
        const value = `${year}-${month.toString().padStart(2, '0')}-H`;
        options.push({ label, value });
      }
    }
    return options;
  };

  const hijriOptions = generateHijriOptions();

  // Tentukan nilai awal dropdown
  const getInitialHijriValue = (): string => {
    if (searchParams.startHijri) return searchParams.startHijri;

    const cal = new UmmalquraCalendar();
    cal.gregorian(new Date()); // Set ke hari ini
    const year = cal.hijriYear;
    const month = (cal.hijriMonth + 1).toString().padStart(2, '0');

    return `${year}-${month}-H`;
  };

  useEffect(() => {
    const initial = getInitialHijriValue();
    setSelectedHijri(initial);
  }, []);

  // Handle saat pilihan diubah
  const handleHijriSelect = (value: string) => {
    setSelectedHijri(value);
    const params = new URLSearchParams();
    params.set('startHijri', value);
    router.replace(`?${params.toString()}`, { scroll: false });

    const [year, month] = value.split('-');
    const cal = new UmmalquraCalendar();
    cal.hijri(parseInt(year), parseInt(month) - 1, 1);
    const startGregorian = cal.toGregorian();
    cal.hijri(parseInt(year), parseInt(month) - 1, cal.daysInMonth());
    const endGregorian = cal.toGregorian();

    console.log('Awal Hijriyah:', value);
    console.log('Awal Masehi:', startGregorian.toLocaleDateString('id-ID'));
    console.log('Akhir Masehi:', endGregorian.toLocaleDateString('id-ID'));
  };

  return (
    <Select value={selectedHijri} onValueChange={handleHijriSelect}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Pilih Bulan Hijriyah' />
      </SelectTrigger>
      <SelectContent>
        {hijriOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
