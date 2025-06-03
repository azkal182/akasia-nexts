"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";

// Schema validasi sesuai Prisma model
const formSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  purpose: z.string().min(1, { message: "Keperluan wajib diisi" }),
  destination: z.string().min(1, { message: "Tujuan wajib diisi" }),
  description: z.string().optional(),
  carId: z.string().min(1, { message: "Armada wajib dipilih" }),
  numberOfPassengers: z.coerce
    .number()
    .min(1, { message: "Jumlah penumpang minimal 1" }),
  date: z.string().min(1, { message: "Tanggal penggunaan wajib diisi" }),
  estimation: z.coerce
    .number()
    .min(1, { message: "Estimasi penggunaan (jam) minimal 1 jam" }),
});

export default function FormulirPerizinanMobil() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      purpose: "",
      destination: "",
      description: "",
      carId: "",
      numberOfPassengers: 1,
      date: "",
      estimation: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Ubah sesuai struktur schema backend
      const response = await axios.post("/api/perizinan", {
        name: values.name,
        purpose: values.purpose,
        destination: values.destination,
        description: values.description, // jika ingin kosong, atau bisa ditambahkan field di form
        numberOfPassengers: values.numberOfPassengers,
        date: new Date(values.date),
        estimation: values.estimation, // dalam hari
        carId: values.carId,
      });

      alert("Data berhasil dikirim!");
      console.log("Response:", response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Gagal mengirim data:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat mengirim data"
      );
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Formulir Perizinan Membawa Mobil
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keperluan</FormLabel>
                <FormControl>
                  <Input placeholder="Keperluan membawa mobil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tujuan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Semisal asrama atau departemen tertentu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan Tambahan</FormLabel>
                <FormControl>
                  <Input placeholder="Opsional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Armada</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih armada" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0c96a8f7-6cdb-4e48-b30b-270ede71becc">
                      Toyota Avanza
                    </SelectItem>
                    <SelectItem value="innova-id">Toyota Innova</SelectItem>
                    <SelectItem value="hiace-id">Toyota HiAce</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfPassengers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Penumpang</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Jumlah penumpang"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Penggunaan</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimasi Penggunaan</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Jumlah hari"
                      {...field}
                      className="pr-16" // beri padding kanan agar teks tidak menimpa
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground pointer-events-none">
                      hari
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Kirim Permohonan
          </Button>
        </form>
      </Form>
    </Card>
  );
}
