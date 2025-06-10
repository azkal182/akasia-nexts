'use client';
import { DatePickerDemo } from '@/components/date-picker-demo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { inputPemasukan } from '@/actions/keuangan';
import PageContainer from '@/components/layout/page-container';
import { useCurrentSession } from '@/hooks/use-current-user';

interface Item {
  no: number;
  description: string;
  amount: number;
}

const PemasukanPage = () => {
  const [incomes, setIncomes] = useState<Item[]>([]);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newTotal, setNewTotal] = useState<number>(0);
  const [isTotalFocused, setIsTotalFocused] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [pending, setPending] = useState(false);
  const { session } = useCurrentSession();
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  function sumTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleAddIncome = () => {
    const newIncome: Item = {
      no: incomes.length + 1,
      description: newDescription,
      amount: newTotal
    };

    setIncomes((prevIncomes) => [...prevIncomes, newIncome]);
    setNewDescription('');
    setNewTotal(0);
  };

  const handleDeleteIncome = (no: number) => {
    setIncomes((prevIncomes) =>
      prevIncomes.filter((income) => income.no !== no)
    );
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    setNewTotal(numericValue);
  };

  const handleSubmit = async () => {
    setPending(true);
    toast.promise(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      inputPemasukan(selectedDate, incomes, session!.user!.id),
      {
        position: 'top-right',
        loading: 'Menyimpan...',
        success: (data) => {
          setPending(false);
          setIncomes([]);
          return data?.message;
        },
        error: () => {
          setPending(false);
          return 'Gagal mencatat pemasukan';
        }
      }
    );
  };
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <Card className='p-4 max-w-[calc(100vw-2rem)] md:max-w-full'>
          <h1 className='text-center font-bold text-xl'>Pemasukan AKASIA</h1>
          <div className='w-full md:w-60'>
            <Label>Tanggal</Label>
            <div className='mt-2'>
              <DatePickerDemo
                defaultDate={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-4 mt-2'>
            <div className='w-full md:w-60'>
              <Label>Keterangan</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className='w-full md:w-60'>
              <Label>Total</Label>
              <Input
                type='text'
                inputMode='numeric'
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
            <Button
              disabled={newDescription === '' || newTotal === 0}
              className='mt-auto w-full md:w-32'
              onClick={handleAddIncome}
            >
              Tambah
            </Button>
          </div>

          {/* Tabel */}
          <div className='mt-4'>
            <Table>
              <TableCaption>Daftar pemasukan terbaru.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>No</TableHead>
                  <TableHead className='w-full '>Keterangan</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                  <TableHead className='text-center'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center text-gray-500'
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  incomes.map((income) => (
                    <TableRow key={income.no}>
                      <TableCell>{income.no}</TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='destructive'
                          onClick={() => handleDeleteIncome(income.no)}
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
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(sumTotal(incomes))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className='flex justify-end mt-4'>
              <Button
                disabled={pending || incomes.length === 0}
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

export default PemasukanPage;
