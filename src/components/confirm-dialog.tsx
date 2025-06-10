import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps<T = unknown> {
  title: string;
  description: string;
  onSubmit: (data?: T) => void;
  data?: T;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog<T = unknown>({
  title,
  description,
  onSubmit,
  data,
  trigger,
  open,
  onOpenChange
}: ConfirmDialogProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  const handleSubmit = () => {
    onSubmit(data);
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Konfirmasi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
