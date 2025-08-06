// 'use client';

// import { useEffect, useState } from 'react';
// import { format, startOfMonth, endOfMonth } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { useRouter } from 'next/navigation';

// type MonthOption = {
//   label: string;
//   value: string;
// };

// type Props = {
//   searchParams: { startDate?: string; endDate?: string };
// };

// export default function MonthYearSelect({ searchParams }: Props) {
//   const router = useRouter();
//   const timeZone = 'Asia/Jakarta'; // Zona waktu lokal

//   // Fungsi untuk menghasilkan opsi bulan dari Januari 2025 hingga bulan sekarang
//   const generateMonthOptions = (): MonthOption[] => {
//     const options: MonthOption[] = [];
//     const startDate = toZonedTime(new Date(2025, 0, 1), timeZone);
//     const endDate = toZonedTime(new Date(), timeZone);

//     let current = startDate;
//     while (current <= endDate) {
//       const month = format(current, 'MMMM', { locale: undefined });
//       const year = format(current, 'yyyy');
//       const monthIndex = format(current, 'MM'); // Pastikan format 2 digit

//       options.push({
//         label: `${month} ${year}`,
//         value: `${year}-${monthIndex}`
//       });

//       current = toZonedTime(
//         new Date(current.setMonth(current.getMonth() + 1)),
//         timeZone
//       );
//     }
//     return options;
//   };

//   const monthOptions = generateMonthOptions();

//   // Nilai default bulan saat ini dalam format YYYY-MM
//   const currentMonth = format(toZonedTime(new Date(), timeZone), 'yyyy-MM');

//   // Fungsi untuk mendapatkan nilai awal dari searchParams
//   const getInitialValue = () => {
//     if (searchParams.startDate) {
//       const date = toZonedTime(new Date(searchParams.startDate), timeZone);
//       return format(date, 'yyyy-MM');
//     }
//     return currentMonth;
//   };

//   const [selectedMonth, setSelectedMonth] = useState(getInitialValue());

//   // Fungsi untuk memformat tanggal menjadi YYYY-MM-DD
//   const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

//   // Efek untuk memperbarui URL saat `selectedMonth` berubah
//   useEffect(() => {
//     const [year, month] = selectedMonth.split('-');
//     const startDate = startOfMonth(
//       toZonedTime(new Date(parseInt(year), parseInt(month) - 1, 1), timeZone)
//     );
//     const endDate = endOfMonth(startDate);

//     const params = new URLSearchParams();
//     params.set('startDate', formatDate(startDate));
//     params.set('endDate', formatDate(endDate));

//     router.replace(`?${params.toString()}`, { scroll: false });
//   }, [selectedMonth]);

//   // Fungsi untuk menangani perubahan bulan yang dipilih
//   const handleMonthSelect = (value: string) => {
//     setSelectedMonth(value);

//     const [year, month] = value.split('-');
//     const selectedDate = toZonedTime(
//       new Date(parseInt(year), parseInt(month) - 1, 1),
//       timeZone
//     );
//     const startDate = startOfMonth(selectedDate);
//     const endDate = endOfMonth(selectedDate);

//     console.log('Tanggal Awal:', formatDate(startDate));
//     console.log('Tanggal Akhir:', formatDate(endDate));
//   };

//   return (
//     <Select value={selectedMonth} onValueChange={handleMonthSelect}>
//       <SelectTrigger className='w-[180px]'>
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent>
//         {monthOptions.map((option) => (
//           <SelectItem key={option.value} value={option.value}>
//             {option.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import moment from 'moment-hijri'; // Import moment-hijri

// Atur lokal untuk nama bulan dalam Bahasa Indonesia
moment.locale('id');
moment.updateLocale('id', {
  iMonths: [
    'Muharram',
    'Safar',
    'Rabiul Awal',
    'Rabiul Akhir',
    'Jumadil Awal',
    'Jumadil Akhir',
    'Rajab',
    'Syaban',
    'Ramadhan',
    'Syawal',
    'Zulkaidah',
    'Zulhijah'
  ]
});

type MonthOption = {
  label: string;
  value: string;
};

type Props = {
  searchParams: { startDate?: string; endDate?: string };
};

export default function MonthYearSelect({ searchParams }: Props) {
  const router = useRouter();

  // Fungsi untuk menghasilkan opsi bulan Hijriyah dari Januari 2025 hingga bulan ini
  const generateHijriMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = [];
    const startDateLimit = moment('2025-01-01'); // Batas awal Masehi
    const current = moment(); // Mulai dari hari ini

    // Iterasi mundur dari bulan ini hingga mencapai batas awal
    while (current.isAfter(startDateLimit)) {
      options.push({
        label: current.format('iMMMM iYYYY'), // Format: "Safar 1447"
        value: current.format('iYYYY-iMM') // Format: "1447-02"
      });
      // Pindah ke bulan Hijriyah sebelumnya
      current.subtract(1, 'iMonth');
    }
    return options;
  };

  const monthOptions = generateHijriMonthOptions();

  // Fungsi untuk mendapatkan nilai awal dari searchParams atau tanggal saat ini
  const getInitialValue = () => {
    if (searchParams.startDate) {
      return moment(searchParams.startDate, 'YYYY-MM-DD').format('iYYYY-iMM');
    }
    return moment().format('iYYYY-iMM');
  };

  const [selectedMonth, setSelectedMonth] = useState(getInitialValue());

  // Efek untuk memperbarui URL saat `selectedMonth` berubah
  useEffect(() => {
    // Buat objek moment dari bulan Hijriyah yang dipilih (misal: "1447-02")
    const hijriDate = moment(selectedMonth, 'iYYYY-iMM');

    // Dapatkan tanggal awal dan akhir Masehi dari bulan Hijriyah tersebut
    const startDate = hijriDate.clone().startOf('iMonth').format('YYYY-MM-DD');
    const endDate = hijriDate.clone().endOf('iMonth').format('YYYY-MM-DD');

    // ==================================================================
    // >> START: BLOK DEBUGGING <<
    // Log ini akan muncul di konsol browser (Inspect > Console)
    console.group(`🔄 Konversi Bulan: ${hijriDate.format('iMMMM iYYYY')}`);
    console.log('Nilai Dipilih (Hijriyah):', selectedMonth);
    console.log('Tanggal Awal (Masehi):', startDate);
    console.log('Tanggal Akhir (Masehi):', endDate);
    console.groupEnd();
    // >> END: BLOK DEBUGGING <<
    // ==================================================================

    // Buat query string dan update URL
    const params = new URLSearchParams();
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedMonth, router]);

  // Handler untuk mengubah state saat bulan baru dipilih
  const handleMonthSelect = (value: string) => {
    setSelectedMonth(value);
  };

  return (
    <Select value={selectedMonth} onValueChange={handleMonthSelect}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Pilih Bulan' />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
