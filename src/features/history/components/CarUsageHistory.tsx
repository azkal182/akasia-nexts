'use client';

import { RecordResponse } from '@/actions/usage-record';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import ExportButton from './export-button';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Props = {
  data: RecordResponse[];
};

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

export default function CarUsageHistory({ data }: Props) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [history, setHistory] = useState<RecordResponse[]>([]);

  useEffect(() => {
    async function fetchReport() {
      const data = await fetch(
        `/api/usage-records?year=${year}&month=${month}`
      ).then((res) => res.json());
      setHistory(data);
    }
    fetchReport();
    console.log(year, month);
  }, [year, month]);
  return (
    <Card className={'max-w-[calc(100vw-2rem)] md:max-w-full'}>
      <CardContent className='p-4'>
        <CardHeader>
          <h2 className='text-xl font-semibold mb-4'>
            Histori Penggunaan Mobil
          </h2>
          <div className='flex space-x-4 items-center'>
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

            <ExportButton disable={false} month={month} year={year} />
          </div>
        </CardHeader>
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Mobil</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead>Driver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.car.name}</TableCell>
                  <TableCell>{item.purpose}</TableCell>
                  <TableCell>{item.destination}</TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(item.startTime), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(item!.endTime!), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {item!.User!.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
