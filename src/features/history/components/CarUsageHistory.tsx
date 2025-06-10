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

type Props = {
  data: RecordResponse[];
};

export default function CarUsageHistory({ data }: Props) {
  return (
    <Card className={'max-w-[calc(100vw-2rem)] md:max-w-full'}>
      <CardContent className='p-4'>
        <CardHeader>
          <h2 className='text-xl font-semibold mb-4'>
            Histori Penggunaan Mobil
          </h2>
        </CardHeader>
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mobil</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead>Driver</TableHead>
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
