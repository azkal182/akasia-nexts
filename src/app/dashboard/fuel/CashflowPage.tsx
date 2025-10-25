'use client';
import moment from 'moment-hijri';
import React, {
  useState,
  useEffect,
  useRef,
  useTransition,
  useMemo
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FuelType } from '@prisma/client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { purchaseFuelSchema, receiveIncomeSchema } from '@/actions/fuel';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { CalendarIcon, FuelIcon } from 'lucide-react';
import { toRupiah } from '@/lib/rupiah';
import { CarResponse, getCarById } from '@/actions/car';
import { objectToFormData } from '@/lib/objectToFormData';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription
} from '@/components/ui/form';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverContentNonPortal,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import Link from 'next/link';
import { DeleteButtonFuel } from '@/components/deleteButtonFuel';
import { useRouter } from 'next/navigation';
import ExportPdfButton from './exportPdfButton';

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
const hijriMonths = [
  { value: 1, label: 'Muharram' },
  { value: 2, label: 'Safar' },
  { value: 3, label: 'Rabiul Awal' },
  { value: 4, label: 'Rabiul Akhir' },
  { value: 5, label: 'Jumadil Awal' },
  { value: 6, label: 'Jumadil Akhir' },
  { value: 7, label: 'Rajab' },
  { value: 8, label: 'Syaban' },
  { value: 9, label: 'Ramadhan' },
  { value: 10, label: 'Syawal' },
  { value: 11, label: 'Zulkaidah' },
  { value: 12, label: 'Zulhijah' }
];

type IncomeFormInput = z.infer<typeof receiveIncomeSchema>;
type PurchaseFuelFormInput = z.infer<typeof purchaseFuelSchema>;

export type ReportItem = {
  id: string;
  date: string;
  description: string | null;
  notes: string | null;
  credit: number;
  debit: number;
  runningBalance: number;
  receiptFile: string | null;
};

export default function CashflowPage({
  cars,
  role
}: {
  cars: CarResponse[];
  role: string;
}) {
  const [report, setReport] = useState<ReportItem[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCar, setSelectedCar] = useState<CarResponse | null>(null);
  const [openIncome, setOpenIncome] = useState(false);
  const [openFuel, setOpenFuel] = useState(false);
  const inputAmountRef = useRef<HTMLInputElement>(null);
  const [selectedIncome, setSelectedIncome] = useState<IncomeFormInput | null>(
    null
  );
  const [selectedFuel, setSelectedFuel] =
    useState<PurchaseFuelFormInput | null>(null);

  // Inisialisasi dari tanggal hari ini (Hijriyah)
  const [hijriYear, setHijriYear] = useState(() => moment().iYear());
  const [hijriMonth, setHijriMonth] = useState(() => moment().iMonth() + 1);

  // Rentang tahun Hijriyah yang ditampilkan (sesuaikan kebutuhan)
  const hijriYears = useMemo(() => {
    const now = moment().iYear();
    // contoh: tampilkan 1445..1448
    return Array.from({ length: 4 }, (_, i) => now - 1 + i);
  }, []);

  const handleFocus = () => {
    inputAmountRef.current?.select();
  };

  const formIncome = useForm<IncomeFormInput>({
    resolver: zodResolver(receiveIncomeSchema),
    defaultValues: {
      source: 'YAYASAN',
      amount: 0
    }
  });
  const formFuel = useForm<PurchaseFuelFormInput>({
    resolver: zodResolver(purchaseFuelSchema),
    defaultValues: {
      fuelType: FuelType.BENSIN,
      notes: '',
      amount: 0
    }
  });

  const handleSelectedCar = async (id) => {
    const data = await getCarById(id);
    setSelectedCar(data);
  };

  const isLoading =
    isPending ||
    formIncome.formState.isSubmitting ||
    formFuel.formState.isSubmitting;

  // Load report setiap kali year/month berubah
  useEffect(() => {
    async function fetchReport() {
      const data = await fetch(
        `/api/cashflow/report?year=${hijriYear}&month=${hijriMonth}`
      ).then((res) => res.json());
      setReport(data);
    }
    fetchReport();
  }, [hijriYear, hijriMonth]);

  // Submit handler income
  async function onSubmitIncome(data: IncomeFormInput) {
    startTransition(async () => {
      try {
        const res = await fetch('/api/cashflow/receive-income', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          throw new Error('Gagal tambah pemasukan');
        }

        // Reset form dan tutup modal
        formIncome.reset();
        setOpenIncome(false);

        // Refresh laporan
        const reportRes = await fetch(
          `/api/cashflow/report?year=${year}&month=${month}`
        ).then((r) => r.json());

        setReport(reportRes);
        toast.success('Pemasukan berhasil ditambahkan!');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || 'Terjadi kesalahan');
      }
    });
    // try {
    //
    //   const res = await fetch('/api/cashflow/receive-income', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    //   if (!res.ok) throw new Error('Gagal tambah pemasukan');
    //   formIncome.reset();
    //   setOpenIncome(false);
    //   // refresh laporan
    //   const reportRes = await fetch(
    //     `/api/cashflow/report?year=${year}&month=${month}`
    //   ).then((r) => r.json());
    //   setReport(reportRes);
    // } catch (e) {
    //   alert((e as Error).message);
    // }
  }

  // Submit handler fuel
  async function onSubmitFuel(data: PurchaseFuelFormInput) {
    startTransition(async () => {
      try {
        const formData = objectToFormData(data);

        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const res = await fetch('/api/cashflow/purchase-fuel', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error('Gagal tambah pembelian bahan bakar');
        }

        formFuel.reset();
        setPreviewUrl(null);
        setOpenFuel(false);

        const reportRes = await fetch(
          `/api/cashflow/report?year=${year}&month=${month}`
        ).then((r) => r.json());

        setReport(reportRes);
        toast.success('Pembelian bahan bakar berhasil ditambahkan!');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e.message || 'Terjadi kesalahan saat mengirim data');
      }
    });
    // try {
    //   const formData = objectToFormData(data);
    //   for (const [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    //   }
    //
    //   const res = await fetch('/api/cashflow/purchase-fuel', {
    //     method: 'POST',
    //     body: formData
    //     // headers: { 'Content-Type': 'multipart/form-data' }
    //   });
    //   if (!res.ok) throw new Error('Gagal tambah pembelian bahan bakar');
    //   formFuel.reset();
    //   setPreviewUrl(null);
    //   setOpenFuel(false);
    //   const reportRes = await fetch(
    //     `/api/cashflow/report?year=${year}&month=${month}`
    //   ).then((r) => r.json());
    //
    //   setReport(reportRes);
    // } catch (e) {
    //   alert((e as Error).message);
    // }
  }

  // List bulan sederhana
  const months = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 }
  ];

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <h1 className='text-2xl font-bold mb-6'>Laporan Bulanan Cashflow</h1>

      <Card className={'max-w-[calc(100vw-2rem)] md:max-w-full'}>
        <CardContent className={'pt-6'}>
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            {/* <Select
              value={year.toString()}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger className='w-full md:w-[100px]'>
                <SelectValue placeholder='Tahun' />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={month.toString()}
              onValueChange={(value) => setMonth(parseInt(value))}
            >
              <SelectTrigger className='w-full md:w-[150px]'>
                <SelectValue placeholder='Bulan' />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            {/* Year (Hijriyah) */}
            <Select
              value={hijriYear.toString()}
              onValueChange={(value) => setHijriYear(parseInt(value))}
            >
              <SelectTrigger className='w-full md:w-[120px]'>
                <SelectValue placeholder='Tahun (H)' />
              </SelectTrigger>
              <SelectContent>
                {hijriYears.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y} H
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Month (Hijriyah) */}
            <Select
              value={hijriMonth.toString()}
              onValueChange={(value) => setHijriMonth(parseInt(value))}
            >
              <SelectTrigger className='w-full md:w-[180px]'>
                <SelectValue placeholder='Bulan (Hijriyah)' />
              </SelectTrigger>
              <SelectContent>
                {hijriMonths.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={openIncome} onOpenChange={setOpenIncome}>
              <DialogTrigger asChild>
                <Button variant='outline'>Tambah Pemasukan</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                  <DialogTitle>Tambah Pemasukan</DialogTitle>
                  <DialogDescription>
                    Isi formulir untuk mencatat pemasukan baru.
                  </DialogDescription>
                </DialogHeader>
                <Form {...formIncome}>
                  <form onSubmit={formIncome.handleSubmit(onSubmitIncome)}>
                    <div className={'flex flex-col gap-1'}>
                      <FormField
                        control={formIncome.control}
                        name={'date'}
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel>Tanggal</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP', {
                                        locale: id
                                      })
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>

                              <PopoverContentNonPortal
                                className='w-auto p-0 z-[999]'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  locale={id}
                                  initialFocus
                                />
                              </PopoverContentNonPortal>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formIncome.control}
                        name={'amount'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah (Rp)</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                onFocus={(e) => e.target.select()}
                                {...field}
                                ref={(el) => {
                                  field.ref(el); // ref dari react-hook-form
                                  inputAmountRef.current = el; // ref lokal kita
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formIncome.control}
                        name={'source'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sumbar Dana</FormLabel>
                            <FormControl>
                              <Input type={'text'} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formIncome.control}
                        name={'notes'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Catatan</FormLabel>
                            <FormControl>
                              <Input type={'text'} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className={'mt-4'}>
                      <Button disabled={isLoading} type='submit'>
                        {isLoading ? 'Processing...' : 'Simpan'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={openFuel} onOpenChange={setOpenFuel} modal={true}>
              <DialogTrigger asChild>
                <Button variant='default'>
                  <FuelIcon /> Beli Bahan Bakar
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md overflow-y-scroll max-h-[80vh]'>
                <DialogHeader>
                  <DialogTitle>Beli Bahan Bakar</DialogTitle>
                </DialogHeader>
                <Form {...formFuel}>
                  <form
                    onSubmit={formFuel.handleSubmit(onSubmitFuel)}
                    className='space-y-4 mt-4'
                  >
                    <FormField
                      control={formFuel.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Tanggal</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', {
                                      locale: id
                                    })
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContentNonPortal
                              className='w-auto p-0 z-[999]'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={id}
                                initialFocus
                              />
                            </PopoverContentNonPortal>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formFuel.control}
                      name='carId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Armada</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              //   console.log('Selected carId:', value);
                              handleSelectedCar(value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Pilih Armada' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cars.map((car) => (
                                <SelectItem key={car.id} value={car.id}>
                                  {car.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {selectedCar && selectedCar.barcodeString && (
                            <Link
                              className='underline text-primary pt-2'
                              target='_blank'
                              href={`/barcode/${selectedCar.barcodeString}`}
                            >
                              Klik Untuk Melihat Barcode
                            </Link>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formFuel.control}
                      name='fuelType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Bahan Bakar</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Pilih jenis Bahan Bakar' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='BENSIN'>BENSIN</SelectItem>
                              <SelectItem value='SOLAR'>SOLAR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formFuel.control}
                      name='amount'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah (Rp)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              onFocus={(e) => e.target.select()}
                              {...field}
                              ref={(el) => {
                                field.ref(el); // ref dari react-hook-form
                                inputAmountRef.current = el; // ref lokal kita
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formFuel.control}
                      name='notes'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=''>Catatan</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              //   className='border-gray-300 focus:border-blue-500'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formFuel.control}
                      name='receiptFile'
                      render={({ field }) => (
                        <FormItem>
                          <section className='container w-full mx-auto items-center'>
                            <div className='max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center'>
                              <div className=''>
                                <div
                                  className='max-w-sm p-6 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer'
                                  onClick={() => inputRef.current?.click()}
                                >
                                  {previewUrl ? (
                                    <Image
                                      src={previewUrl}
                                      alt='Preview'
                                      width={300}
                                      height={300}
                                      className='max-h-48 rounded-lg mx-auto object-contain'
                                    />
                                  ) : (
                                    <>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        className='w-8 h-8 text-gray-700 mx-auto mb-4'
                                      >
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                                        />
                                      </svg>
                                      <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-700'>
                                        Upload Nota
                                      </h5>
                                      <p className='font-normal text-sm text-gray-400 md:px-6'>
                                        Choose photo size less than{' '}
                                        <b className='text-gray-600'>2mb</b>
                                      </p>
                                      <p className='font-normal text-sm text-gray-400 md:px-6'>
                                        and format{' '}
                                        <b className='text-gray-600'>
                                          JPG, PNG, or GIF
                                        </b>
                                      </p>
                                      <span className='text-gray-500 bg-gray-200 px-2 py-1 rounded text-xs'>
                                        {filename || 'No file selected'}
                                      </span>
                                    </>
                                  )}
                                </div>

                                <input
                                  type='file'
                                  accept='image/*'
                                  className='hidden'
                                  ref={inputRef}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    field.onChange(file); // connect ke react-hook-form
                                    if (file) {
                                      setFilename(file.name);
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        setPreviewUrl(
                                          event.target?.result as string
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                    } else {
                                      setPreviewUrl(null);
                                      setFilename(null);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </section>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button disabled={isLoading} type='submit'>
                        {isLoading ? 'Processing...' : 'Simpan'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            {role === 'ADMIN' && <ExportPdfButton data={report} />}
          </div>

          {/* Tabel laporan */}
          {role === 'ADMIN' && (
            <Table className=''>
              <TableHeader>
                <TableRow className=''>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Hijriyah</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead className={'text-right'}>Pemasukan</TableHead>
                  <TableHead className={'text-right'}>Pengeluaran</TableHead>
                  <TableHead className={'text-right'}>Saldo</TableHead>
                  <TableHead className={'text-center'}>Nota</TableHead>
                  <TableHead className={'text-center'}>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center p-4'>
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}

                {report?.map(
                  ({
                    id: idReport,
                    date,
                    description,
                    credit,
                    debit,
                    runningBalance,
                    notes,
                    receiptFile
                  }) => (
                    <TableRow key={idReport}>
                      <TableCell>
                        {format(date, 'PPP', {
                          locale: id
                        })}
                      </TableCell>
                      <TableCell>
                        {moment(date).format('iD iMMMM iYYYY')}
                      </TableCell>
                      <TableCell>{description}</TableCell>
                      <TableCell>{notes}</TableCell>
                      <TableCell className={'text-right text-nowrap'}>
                        {credit ? toRupiah(credit) : '-'}
                      </TableCell>
                      <TableCell className={'text-right text-nowrap'}>
                        {debit ? toRupiah(debit) : '-'}
                      </TableCell>
                      <TableCell className='text-right font-semibold text-nowrap'>
                        {toRupiah(runningBalance)}
                      </TableCell>
                      <TableCell className='text-center'>
                        {receiptFile ? (
                          <Link
                            className='underline text-primary'
                            href={receiptFile}
                            target='_blank'
                          >
                            Nota
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className='flex items-centern  space-x-2'>
                        <DeleteButtonFuel
                          idReport={idReport}
                          onDeleted={async () => {
                            toast.success('Data Berhasil Dihapus');
                            const reportRes = await fetch(
                              `/api/cashflow/report?year=${year}&month=${month}`
                            ).then((r) => r.json());

                            setReport(reportRes);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
