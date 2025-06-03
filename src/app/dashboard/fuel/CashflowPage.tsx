'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { CarResponse } from '@/actions/car';
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
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

type IncomeFormInput = z.infer<typeof receiveIncomeSchema>;
type PurchaseFuelFormInput = z.infer<typeof purchaseFuelSchema>;

type ReportItem = {
  id: string;
  date: string;
  description: string | null;
  notes: string | null;
  credit: number;
  debit: number;
  runningBalance: number;
};

export default function CashflowPage({ cars }: { cars: CarResponse[] }) {
  const [report, setReport] = useState<ReportItem[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Dialog state
  const [openIncome, setOpenIncome] = useState(false);
  const [openFuel, setOpenFuel] = useState(false);
  const inputAmountRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputAmountRef.current?.select();
  };

  // --- Form react-hook-form for income ---
  const {
    register: registerIncome,
    handleSubmit: handleSubmitIncome,
    reset: resetIncome,
    formState: { errors: errorsIncome }
  } = useForm<IncomeFormInput>({
    resolver: zodResolver(receiveIncomeSchema)
  });

  // --- Form react-hook-form for fuel purchase ---
  // const {
  //     register: registerFuel,
  //     handleSubmit: handleSubmitFuel,
  //     reset: resetFuel,
  //     control: controlFuel,
  //     formState: { errors: errorsFuel },
  // } = useForm<PurchaseFuelFormInput>({
  //     resolver: zodResolver(purchaseFuelSchema),
  //     defaultValues: {
  //         fuelType: FuelType.BENSIN,
  //         receiptFile: undefined,
  //     },
  // });
  const formFuel = useForm<PurchaseFuelFormInput>({
    resolver: zodResolver(purchaseFuelSchema),
    defaultValues: {
      fuelType: FuelType.BENSIN,
      notes: '',
      amount: 0
    }
  });

  // Load report setiap kali year/month berubah
  useEffect(() => {
    async function fetchReport() {
      const data = await fetch(
        `/api/cashflow/report?year=${year}&month=${month}`
      ).then((res) => res.json());
      setReport(data);
    }
    fetchReport();
  }, [year, month]);

  // Submit handler income
  async function onSubmitIncome(data: IncomeFormInput) {
    try {
      const res = await fetch('/api/cashflow/receive-income', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Gagal tambah pemasukan');
      resetIncome();
      setOpenIncome(false);
      // refresh laporan
      const reportRes = await fetch(
        `/api/cashflow/report?year=${year}&month=${month}`
      ).then((r) => r.json());
      setReport(reportRes);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  // Submit handler fuel
  async function onSubmitFuel(data: PurchaseFuelFormInput) {
    try {
      const formData = objectToFormData(data);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await fetch('/api/cashflow/purchase-fuel', {
        method: 'POST',
        body: formData
        // headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (!res.ok) throw new Error('Gagal tambah pembelian bahan bakar');
      formFuel.reset();
      setPreviewUrl(null);
      setOpenFuel(false);
      const reportRes = await fetch(
        `/api/cashflow/report?year=${year}&month=${month}`
      ).then((r) => r.json());

      setReport(reportRes);
    } catch (e) {
      alert((e as Error).message);
    }
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

      <Card className={'p-4 max-w-[calc(100vw-2rem)] md:max-w-full'}>
        <CardContent className={'pt-6'}>
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            <Select
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

                <form
                  onSubmit={handleSubmitIncome(onSubmitIncome)}
                  className='space-y-4 mt-4'
                >
                  <div>
                    <Label htmlFor='amountIncome'>Jumlah (Rp)</Label>
                    <Input
                      id='amountIncome'
                      type='number'
                      {...registerIncome('amount', { valueAsNumber: true })}
                    />
                    {errorsIncome.amount && (
                      <p className='text-red-600 text-sm'>
                        {errorsIncome.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='sourceIncome'>Sumber</Label>
                    <Input
                      id='sourceIncome'
                      {...registerIncome('source')}
                      placeholder='Yayasan'
                      defaultValue={'Yayasan'}
                    />
                  </div>

                  <div>
                    <Label htmlFor='notesIncome'>Catatan</Label>
                    <Input id='notesIncome' {...registerIncome('notes')} />
                  </div>

                  <DialogFooter>
                    <Button type='submit'>Simpan</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={openFuel} onOpenChange={setOpenFuel}>
              <DialogTrigger asChild>
                <Button variant='default'>
                  <FuelIcon /> Beli Bahan Bakar
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md overflow-y-scroll max-h-screen'>
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
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                              forceMount={true}
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={id}
                                initialFocus
                              />
                            </PopoverContent>
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
                          <Select onValueChange={field.onChange}>
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

                    {/*<FormField*/}
                    {/*  control={formFuel.control}*/}
                    {/*  name='receiptFile'*/}
                    {/*  render={({ field }) => (*/}
                    {/*    <FormItem>*/}
                    {/*      <FormLabel className=''>Upload Bukti</FormLabel>*/}
                    {/*      <FormControl>*/}
                    {/*        <Input*/}
                    {/*          type='file'*/}
                    {/*          accept='.jpg,.jpeg,.png'*/}
                    {/*          onChange={(e) => {*/}
                    {/*            const file = e.target.files?.[0];*/}
                    {/*            field.onChange(file);*/}
                    {/*            if (file) {*/}
                    {/*              const previewUrl = URL.createObjectURL(file);*/}
                    {/*              setPhotoPreview(previewUrl);*/}
                    {/*            } else {*/}
                    {/*              setPhotoPreview(null);*/}
                    {/*            }*/}
                    {/*          }}*/}
                    {/*          //   className='border-gray-300 focus:border-blue-500'*/}
                    {/*        />*/}
                    {/*      </FormControl>*/}
                    {/*      <FormMessage />*/}
                    {/*    </FormItem>*/}
                    {/*  )}*/}
                    {/*/>*/}

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
                      <Button type='submit'>Simpan</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabel laporan */}
          <Table className=''>
            <TableHeader>
              <TableRow className=''>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Pemasukan</TableHead>
                <TableHead>Pengeluaran</TableHead>
                <TableHead>Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center p-4'>
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}

              {report.map(
                ({
                  id,
                  date,
                  description,
                  credit,
                  debit,
                  runningBalance,
                  notes
                }) => (
                  <TableRow key={id}>
                    <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
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
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
