// components/DeleteButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeleteButtonProps {
  idReport: string;
  onDeleted?: () => void; // Optional callback setelah delete
}

export function DeleteButtonFuel({ idReport, onDeleted }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cashflow/${idReport}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        // throw new Error("Gagal menghapus data");
        toast.error('Gagal menghapus data');
      }

      if (onDeleted) onDeleted();
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menghapus.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={'sm'} variant='destructive'>
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data cashflow akan hilang
            permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Menghapus...' : 'Ya, hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
