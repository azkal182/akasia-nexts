'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Car } from '@prisma/client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useCurrentSession } from '@/hooks/use-current-user';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { CalendarField } from '@/components/calendarField';
import { toast } from 'sonner';

interface CarListingProps {
  cars: Car[];
}

// Form validation schema
const formSchema = z.object({
  purpose: z.string().min(3, 'Tujuan harus minimal 3 karakter'),
  destination: z.string().min(3, 'Lokasi tujuan harus minimal 3 karakter')
});

type FormValues = z.infer<typeof formSchema>;

const formCarSchema = z.object({
  name: z.string().min(1, 'Nama Harus di isi'),
  licensePlate: z.string().min(1, 'Plat Nomor wajib diisi'),
  taxAnnual: z.date(),
  fiveYear: z.date()
});

type FormCarInput = z.infer<typeof formCarSchema>;

const CarListing = ({ cars }: CarListingProps) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useCurrentSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: '',
      destination: ''
    }
  });

  const formCar = useForm<FormCarInput>({
    resolver: zodResolver(formCarSchema),
    defaultValues: {
      name: '',
      licensePlate: ''
    }
  });

  const closeDialog = () => {
    setSelectedCar(null);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    // alert(`Mobil ${selectedCar.name} berhasil dicatat keluar!`);
    if (!selectedCar || !session.session?.user?.id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/usage-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          carId: selectedCar.id,
          userId: session.session.user.id,
          purpose: data.purpose,
          destination: data.destination
        })
      });

      if (response.ok) {
        alert('Mobil berhasil dicatat keluar');
        closeDialog();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCar = async (data: FormCarInput) => {
    // alert(JSON.stringify(data));
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error('Gagal tambah pembelian bahan bakar');
      }
      toast.success('Armada berhasil ditambahkan');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.message || 'Terjadi kesalahan saat mengirim data');
    }
  };

  return (
    <div className='p-4'>
      <span>{JSON.stringify(session.session)} sdsd</span>
      <Card className={'max-w-[calc(100vw-2rem)] md:max-w-full'}>
        <CardHeader>
          <div>
            <Button>Tambah</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Plat</TableHead>
                  <TableHead>Tersedia</TableHead>
                  <TableHead>Drive</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars?.map((car, index) => (
                  <TableRow key={car.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{car.name}</TableCell>
                    <TableCell>{car.licensePlate}</TableCell>
                    <TableCell>
                      {car.status === 'AVAILABLE' ? (
                        <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                          AVAILABLE
                        </span>
                      ) : (
                        <span className='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'>
                          IN USE
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {car.status === 'AVAILABLE' ? (
                        <Button
                          onClick={() => setSelectedCar(car)}
                          size='sm'
                          variant='outline'
                        >
                          <CarIcon /> Berangkat
                        </Button>
                      ) : (
                        <Button size='sm'>Info</Button>
                      )}
                    </TableCell>
                    <TableCell>aksi</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Mobil</DialogTitle>
          </DialogHeader>
          <Form {...formCar}>
            <form onSubmit={formCar.handleSubmit(handleSubmitCar)}>
              <div className={'space-y-2'}>
                <FormField
                  control={formCar.control}
                  name={'name'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Mobil</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formCar.control}
                  name={'licensePlate'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plat Nomor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formCar.control}
                  name={'taxAnnual'}
                  render={({ field }) => (
                    <CalendarField field={field} label={'Pajak Tahunan'} />
                  )}
                />
                <FormField
                  control={formCar.control}
                  name={'fiveYear'}
                  render={({ field }) => (
                    <CalendarField field={field} label={'Pajak 5 Tahunan'} />
                  )}
                />
                <DialogFooter className={'mt-2'}>
                  <Button>Simpan</Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedCar} onOpenChange={closeDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Form Mobil Keluar</DialogTitle>
            <DialogDescription>
              Masukkan detail penggunaan mobil {selectedCar?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='purpose'>Keperluan</Label>
              <Input
                id='purpose'
                placeholder='Masukkan tujuan penggunaan'
                {...register('purpose')}
              />
              {errors.purpose && (
                <p className='text-sm text-red-500'>{errors.purpose.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='destination'>Lokasi Tujuan</Label>
              <Input
                id='destination'
                placeholder='Masukkan lokasi tujuan'
                {...register('destination')}
              />
              {errors.destination && (
                <p className='text-sm text-red-500'>
                  {errors.destination.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarListing;
