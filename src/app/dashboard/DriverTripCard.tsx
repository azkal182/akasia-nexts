'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { type UsageRecord } from './page';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { CurrentStatus } from '../../../types/current-status';
import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { purchaseFuelSchema } from '@/actions/fuel';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FuelType } from '@prisma/client';
import { id } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { CalendarIcon, FuelIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContentNonPortal,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { CarResponse } from '@/actions/car';
import { toast } from 'sonner';
import { objectToFormData } from '@/lib/objectToFormData';

interface DriverTripCardProps {
  currentStatus: CurrentStatus;
  onComplete: ({ id, userId }: { id: string; userId: string }) => void;
}
type PurchaseFuelFormInput = z.infer<typeof purchaseFuelSchema>;

export default function DriverTripCard({
  currentStatus,
  onComplete
}: DriverTripCardProps) {
  const [openFuel, setOpenFuel] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputAmountRef = useRef<HTMLInputElement>(null);

  const formFuel = useForm<PurchaseFuelFormInput>({
    resolver: zodResolver(purchaseFuelSchema),
    defaultValues: {
      fuelType: FuelType.BENSIN,
      notes: '',
      amount: 0,
      carId: currentStatus.carId,
      date: new Date()
    }
  });

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

        toast.success('Pembelian bahan bakar berhasil ditambahkan!');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e.message || 'Terjadi kesalahan saat mengirim data');
      }
    });
  }

  const isLoading = isPending || formFuel.formState.isSubmitting;
  return (
    <Card className='p-4 sm:p-6 '>
      <CardContent className='p-0 space-y-5'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium uppercase tracking-wide'>
              Keperluan
            </span>
            <span className='text-xl text-gray-400 font-bold  mt-1'>
              {currentStatus.purpose}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-medium uppercase tracking-wide'>
              Tujuan
            </span>
            <span className='text-lg font-medium text-gray-400 mt-1'>
              {currentStatus.destination}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-medium uppercase tracking-wide'>
              Waktu Mulai
            </span>
            <span className='text-lg font-medium text-gray-400 mt-1'>
              {currentStatus.startTime
                ? format(new Date(currentStatus.startTime), 'dd/MM/yyyy HH:mm')
                : '-'}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-medium  uppercase tracking-wide'>
              Armada
            </span>
            <span className='text-lg font-medium text-gray-400 mt-1'>
              {currentStatus.car.name}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-medium  uppercase tracking-wide'>
              Driver
            </span>
            <span className='text-lg font-medium text-gray-400 mt-1'>
              {currentStatus?.User?.name}
            </span>
          </div>
        </div>

        {currentStatus.status === 'ONGOING' && (
          //   <Button onClick={() => onComplete(currentStatus.id)}>Selesai</Button>

          <div className='flex items-center justify-between'>
            <ConfirmDialog
              title='Konfirmasi Selesai Perjalanan'
              description={`Apakah Perjalanan ke ${currentStatus.destination} keperluan ${currentStatus.purpose} sudah selesai?`}
              data={currentStatus}
              onSubmit={(data) =>
                onComplete({ id: data!.id, userId: data!.userId! })
              }
              trigger={<Button>Selesai</Button>}
            />
            <Dialog open={openFuel} onOpenChange={setOpenFuel} modal={true}>
              <DialogTrigger asChild>
                <Button variant='default'>
                  <FuelIcon /> Isi BBM
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md overflow-y-scroll max-h-[80vh]'>
                <DialogHeader>
                  <DialogTitle> isi Bahan Bakar</DialogTitle>
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
                    {/* <FormField
                      control={formFuel.control}
                      name='carId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Armada</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
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
                    /> */}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
