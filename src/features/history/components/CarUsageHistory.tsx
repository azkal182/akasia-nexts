'use client';

import { RecordResponse } from '@/actions/usage-record';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';

type Props = {
  data: RecordResponse[];
};

export default function CarUsageHistory({ data }: Props) {
  return (
    <Card>
      <CardContent className='p-4'>
        <h2 className='text-xl font-semibold mb-4'>Histori Penggunaan Mobil</h2>
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mobil</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead>Pengguna</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.car.name}</TableCell>
                  <TableCell>{item.destination}</TableCell>
                  <TableCell>{item.purpose}</TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(item.startTime), 'dd MMM yyyy HH:mm')}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(item!.endTime!), 'dd MMM yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{item!.User!.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
