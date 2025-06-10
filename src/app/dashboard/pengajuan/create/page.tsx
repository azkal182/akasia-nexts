// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { createPengajuan, getCars } from "@/actions/pengajuan-dana";
// import { toast } from "sonner";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useRouter } from "next/navigation";

// type Car = {
//   id: string;
//   name: string;
// };

// const pengajuanSchema = z.object({
//   requirement: z.string().min(1, "Kebutuhan harus diisi"),
//   cardId: z.string().min(1, "Pilih kendaraan"),
//   estimation: z.coerce.number().min(1, "Estimasi harus lebih dari 0"),
//   image: z.instanceof(File).optional(),
// });

// type PengajuanItem = z.infer<typeof pengajuanSchema>;

// const CreatePengajuanPage = () => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm<PengajuanItem>({
//     resolver: zodResolver(pengajuanSchema),
//     defaultValues: {
//       requirement: "",
//       cardId: "",
//       estimation: 0,
//       image: undefined,
//     },
//   });

//   const [cars, setCars] = useState<Car[]>([]);
//   const [items, setItems] = useState<PengajuanItem[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     getCars().then(setCars);
//   }, []);

//   const addItem = (data: PengajuanItem) => {
//     const car = cars.find((car) => car.id === data.cardId);
//     if (!car) {
//       toast.error("Harap pilih kendaraan yang valid.");
//       return;
//     }

//     setItems([...items, data]);
//     setValue("requirement", "");
//     setValue("cardId", "");
//     setValue("estimation", 0);
//     setValue("image", undefined);
//   };

//   const removeItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const onSubmit = async () => {
//     if (items.length === 0) {
//       toast.error("Harap tambahkan minimal satu kebutuhan.");
//       return;
//     }

//     const response = await createPengajuan({ items });

//     if (response?.error) {
//       toast.error("Terjadi kesalahan");
//     } else {
//       toast.success("Data telah tersimpan.");
//       setItems([]);
//       reset();
//       router.push("/dashboard/pengajuan");
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Form Pengajuan Dana</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form
//           onSubmit={handleSubmit(addItem)}
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4"
//         >
//           <div>
//             <Input {...register("requirement")} placeholder="Kebutuhan" />
//             {errors.requirement && (
//               <p className="text-red-500 text-sm">
//                 {errors.requirement.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Select
//               {...register("cardId")}
//               onValueChange={(val) => setValue("cardId", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Pilih Kendaraan" />
//               </SelectTrigger>
//               <SelectContent>
//                 {cars.map((car) => (
//                   <SelectItem key={car.id} value={car.id}>
//                     {car.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {errors.cardId && (
//               <p className="text-red-500 text-sm">{errors.cardId.message}</p>
//             )}
//           </div>

//           <div>
//             <Input
//               type="number"
//               {...register("estimation")}
//               placeholder="Estimasi Biaya"
//             />
//             {errors.estimation && (
//               <p className="text-red-500 text-sm">
//                 {errors.estimation.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) setValue("image", file);
//               }}
//             />
//           </div>

//           <Button type="submit" className="w-full sm:w-auto">
//             Tambah Kebutuhan
//           </Button>
//         </form>

//         {items.length > 0 && (
//           <>
//             <h2 className="mt-6 text-lg font-semibold">Daftar Kebutuhan</h2>
//             <div className="overflow-x-auto">
//               <Table className="min-w-full">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>No</TableHead>
//                     <TableHead>Kebutuhan</TableHead>
//                     <TableHead>Kendaraan</TableHead>
//                     <TableHead>Estimasi Biaya</TableHead>
//                     <TableHead>Aksi</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {items.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>{item.requirement}</TableCell>
//                       <TableCell>{item.cardId}</TableCell>
//                       <TableCell>
//                         Rp {item.estimation.toLocaleString()}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="destructive"
//                           onClick={() => removeItem(index)}
//                         >
//                           Hapus
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             <Button className="mt-4 w-full sm:w-auto" onClick={onSubmit}>
//               Simpan Pengajuan
//             </Button>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CreatePengajuanPage;

'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { createPengajuan, getCars } from '@/actions/pengajuan-dana';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';

type Car = {
  id: string;
  name: string;
};

const pengajuanSchema = z.object({
  requirement: z.string().min(1, 'Kebutuhan harus diisi'),
  cardId: z.string().min(1, 'Pilih kendaraan'),
  estimation: z.coerce.number().min(1, 'Estimasi harus lebih dari 0'),
  image: z.instanceof(File, { message: 'Gambar harus diunggah' }).optional()
});

type PengajuanItem = z.infer<typeof pengajuanSchema>;

const CreatePengajuanPage = () => {
  const form = useForm<PengajuanItem>({
    resolver: zodResolver(pengajuanSchema),
    defaultValues: {
      requirement: '',
      cardId: '',
      estimation: 0,
      image: undefined
    }
  });

  const [cars, setCars] = useState<Car[]>([]);
  const [items, setItems] = useState<PengajuanItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    getCars().then(setCars);
  }, []);

  const addItem = (data: PengajuanItem) => {
    setItems([...items, data]);
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Kosongkan tampilan input file
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (items.length === 0) {
      toast.error('Harap tambahkan minimal satu kebutuhan.');
      return;
    }

    const response = await createPengajuan({ items });
    if (response?.error) {
      toast.error('Terjadi kesalahan');
    } else {
      toast.success('Data telah tersimpan.');
      setItems([]);
      form.reset();

      router.push('/dashboard/pengajuan');
    }
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Form Pengajuan Dana</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(addItem)}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 items-end'
              >
                <FormField
                  name='requirement'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kebutuhan</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Kebutuhan' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='cardId'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kendaraan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih Kendaraan' />
                          </SelectTrigger>
                          <SelectContent>
                            {cars.map((car) => (
                              <SelectItem key={car.id} value={car.id}>
                                {car.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='estimation'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimasi Biaya</FormLabel>
                      <FormControl>
                        {/* <Input
                      type="number"
                      {...field}
                      placeholder="Estimasi Biaya"
                    /> */}
                        <Input
                          type='text'
                          inputMode='numeric'
                          pattern='[0-9]*'
                          placeholder='Estimasi Biaya'
                          value={field.value || ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ''
                            ); // Hanya izinkan angka
                            field.onChange(numericValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='image'
                  control={form.control}
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Unggah Gambar</FormLabel>
                      <FormControl>
                        <Input
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          onChange={(e) => onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full sm:w-auto'>
                  Tambah Kebutuhan
                </Button>
              </form>
            </Form>

            {items.length > 0 && (
              <>
                <h2 className='mt-6 text-lg font-semibold'>Daftar Kebutuhan</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Kebutuhan</TableHead>
                      <TableHead>Kendaraan</TableHead>
                      <TableHead>Estimasi Biaya</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const car = cars.find((car) => car.id === item.cardId); // Temukan nama kendaraan
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.requirement}</TableCell>
                          <TableCell>
                            {car ? car.name : 'Tidak Diketahui'}
                          </TableCell>
                          <TableCell>
                            Rp {item.estimation.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant='destructive'
                              onClick={() => removeItem(index)}
                            >
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {/* Tambahkan baris total */}
                    {items.length > 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          style={{ fontWeight: 'bold', textAlign: 'right' }}
                        >
                          Total
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Rp
                          {items
                            .reduce((acc, item) => acc + item.estimation, 0)
                            .toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                        {/* Kosong agar sejajar dengan tombol hapus */}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Button className='mt-4 w-full sm:w-auto' onClick={onSubmit}>
                  Simpan Pengajuan
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CreatePengajuanPage;
