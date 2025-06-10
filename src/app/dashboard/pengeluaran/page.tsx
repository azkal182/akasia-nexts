'use client';
import { DatePickerDemo } from '@/components/date-picker-demo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { inputPengeluaran } from '@/actions/keuangan';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { useCurrentSession } from '@/hooks/use-current-user';

interface Item {
  no: number;
  description: string;
  armada: string;
  quantity: number;
  total: number;
}

const armadaList = [
  { id: '4c862f61-515a-48df-8adb-d524d86247eb', name: 'INNOVA' },
  { id: 'ba0a3c77-d3d6-4b0e-8ce1-ef7e2fc35dfc', name: 'KIJANG MERAH' },
  { id: '6d4046ae-34ba-4da1-9f96-e5c6b781cc4e', name: 'L300 ORANGE' },
  { id: '6b129baf-6fe1-4182-a505-3c1b6c85cce3', name: 'L300 BIRU' },
  { id: 'd44b803e-d743-4eea-96d4-61a9e79a42bc', name: 'ELF LONG' },
  { id: '1e8ac18e-85ed-4c92-947e-db368b18dbd8', name: 'ELF SHORT' },
  { id: '955819e1-9656-43ff-92e3-addc3af97a64', name: 'DUM IJO' },
  { id: '478c39c2-1554-4329-bd77-c2bff4a7d5b7', name: 'DUM KUNING' },
  { id: 'f22a3515-a6a5-4d2b-b023-567347b86b9e', name: 'VENTURER' },
  { id: '2a95494c-fb39-429f-b618-90cbc674d32d', name: 'FORTUNER' },
  { id: 'e0f359bc-4616-48d0-af67-c9d4788af000', name: 'AVANZA BARU' },
  { id: '6ef6a0b7-7f3c-40a2-93e7-c1e31cb19289', name: 'AVANZA VELOZ' },
  { id: '0c96a8f7-6cdb-4e48-b30b-270ede71becc', name: 'LUXIO' },
  { id: 'aa589841-2519-419b-b3c8-910e501207a6', name: 'PANTHER' },
  { id: '9f136c24-b4ae-4530-8eda-f112709eb95a', name: 'TAYO IJO' },
  { id: 'e310c90a-4e0a-4518-abb1-931fb06a0941', name: 'TAYO MERAH' },
  { id: '85235c1b-4b00-4a62-9aec-5cf2a5f8a3bf', name: 'TAYO ORANGE' },
  { id: '63ae5ed6-aa6b-4bc6-aa59-6306a3a73edd', name: 'BIS 1' },
  { id: '41f11cad-6a44-4257-9dfb-f957955ef0a1', name: 'BIS 2' },
  { id: 'e5c0372e-c703-4012-82dd-e316e22ea39e', name: 'AMBULANCE' },
  { id: 'ca3dd982-a906-4c69-ab75-1aad2d1d3232', name: 'HI ACE' },
  { id: '706a0c85-038e-4350-a9b7-91fe28c18d97', name: 'X-PANDER' }
];

const PengeluaranPage = () => {
  const [invoices, setInvoices] = useState<Item[]>([]);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newArmada, setNewArmada] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newTotal, setNewTotal] = useState<number>(0);
  const [isTotalFocused, setIsTotalFocused] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [pending, setPending] = useState(false);
  const [newNota, setNewNota] = useState<File | null>(null);
  const [newArmadaName, setNewArmadaName] = useState<string>('');
  const { session } = useCurrentSession();
  const handleArmadaChange = (id: string) => {
    setNewArmada(id);
    const selected = armadaList.find((item) => item.id === id);
    setNewArmadaName(selected ? selected.name : '');
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  function sumTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleAddInvoice = () => {
    const newInvoice: Item = {
      no: invoices.length + 1,
      description: newDescription,
      armada: newArmadaName,
      quantity: newQuantity,
      total: newTotal
    };

    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
    setNewDescription('');
    setNewArmada('');
    setNewArmadaName('');
    setNewQuantity(1);
    setNewTotal(0);
    // setNewNota(null); // Reset file nota setelah menambahkannya
  };

  const handleDeleteInvoice = (no: number) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.no !== no)
    );
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    setNewTotal(numericValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Mendapatkan file pertama jika ada
    setNewNota(file); // Menyimpan file nota yang dipilih
  };

  const handleSubmit = async () => {
    if (pending) return; // Mencegah double submit
    setPending(true);

    if (newDescription !== '' || newArmada !== '' || newTotal !== 0) {
      toast('Tombol tambah belum ditekan atau hapus isian', {
        position: 'top-right'
      });
      setPending(false); // Kembalikan false jika gagal
      return;
    }

    if (newNota === null) {
      toast('Nota belum ada', { position: 'top-right' });
      setPending(false); // Kembalikan false jika gagal
      return;
    }

    toast.promise(
      inputPengeluaran(
        selectedDate as Date,
        newDescription,
        invoices,
        newNota,
        session!.user!.id
      ),
      {
        position: 'top-right',
        loading: 'Menyimpan...',
        success: (data) => {
          setPending(false);
          setInvoices([]);
          setNewNota(null);
          return data?.message;
        },
        error: () => {
          setPending(false);
          return 'Gagal mencatat pengeluaran';
        }
      }
    );
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <Card className='p-4 max-w-[calc(100vw-2rem)] md:max-w-full'>
          <h1 className='text-center font-bold text-xl'>Pengeluaran AKASIA</h1>
          <div>
            <Label>Tanggal</Label>
            <div className='mt-2 w-full md:w-60'>
              <DatePickerDemo
                defaultDate={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
            <div className='md:col-span-3'>
              <Label>Keterangan</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className='md:col-span-3'>
              <Label>Armada</Label>
              <Select value={newArmada} onValueChange={handleArmadaChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Pilih armada' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Armada</SelectLabel>
                    {armadaList.map((armada) => (
                      <SelectItem key={armada.id} value={armada.id}>
                        {armada.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='md:col-span-2'>
              <Label>Jumlah</Label>
              <Input
                inputMode='numeric'
                className='w-full'
                type='number'
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
              />
            </div>
            <div className='md:col-span-3'>
              <Label>Total</Label>
              <Input
                inputMode='numeric'
                type='text'
                value={
                  isTotalFocused
                    ? newTotal === 0
                      ? ''
                      : newTotal.toString()
                    : formatCurrency(newTotal)
                }
                onChange={handleTotalChange}
                onFocus={() => setIsTotalFocused(true)}
                onBlur={() => setIsTotalFocused(false)}
                placeholder='Masukkan total'
              />
            </div>

            {/* Input untuk upload nota */}
            <div className='md:col-span-3'>
              <Label>Nota</Label>
              <Input type='file' onChange={handleFileChange} accept='image/*' />
              {newNota && <p className='mt-2 text-sm'>{newNota.name}</p>}
            </div>

            <Button
              disabled={newDescription === '' || newTotal === 0}
              type='submit'
              className='mt-auto'
              onClick={handleAddInvoice}
            >
              Tambah
            </Button>
          </div>

          {/* Tabel */}
          <div className='mt-4 overflow-x-auto'>
            <Table className='w-full'>
              <TableCaption>Daftar pengeluaran terbaru.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>No</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Armada</TableHead>
                  <TableHead className='w-32 text-center'>Jumlah</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                  <TableHead className='text-center w-20'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center text-gray-500'
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.no}>
                      <TableCell>{invoice.no}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{invoice.armada}</TableCell>
                      <TableCell className='text-center'>
                        {invoice.quantity}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='destructive'
                          size={'sm'}
                          onClick={() => handleDeleteInvoice(invoice.no)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(sumTotal(invoices))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className='flex justify-end mt-4'>
              <Button
                type='submit'
                disabled={pending || invoices.length === 0}
                onClick={handleSubmit}
              >
                {pending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PengeluaranPage;
