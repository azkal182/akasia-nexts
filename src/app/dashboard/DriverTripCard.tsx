import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { type UsageRecord } from './page';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface DriverTripCardProps {
  currentStatus: UsageRecord;
  onComplete: ({ id, userId }: { id: string; userId: string }) => void;
}

export default function DriverTripCard({
  currentStatus,
  onComplete
}: DriverTripCardProps) {
  return (
    <Card className='p-4 sm:p-6 mx-2 sm:mx-auto max-w-7xl'>
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
                ? format(
                    new Date(currentStatus.startTime),
                    'dd MMM yyyy - HH:mm'
                  )
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
        </div>

        {currentStatus.status === 'ONGOING' && (
          //   <Button onClick={() => onComplete(currentStatus.id)}>Selesai</Button>
          <ConfirmDialog
            title='Konfirmasi Selesai Perjalanan'
            description={`Apakah Perjalanan ke ${currentStatus.destination} keperluan ${currentStatus.purpose} sudah selesai?`}
            data={currentStatus}
            onSubmit={(data) =>
              onComplete({ id: data!.id, userId: data!.userId })
            }
            trigger={<Button>Selesai</Button>}
          />
        )}
      </CardContent>
    </Card>
  );
}
