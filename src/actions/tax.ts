import prisma from '@/lib/prisma';
import { addYears } from 'date-fns';

export const payTax = async (taxId: string, paidDate: Date = new Date()) => {
  const tax = await prisma.tax.findUnique({
    where: { id: taxId },
    include: { car: true }
  });

  if (!tax || tax.isPaid) {
    throw new Error('Pajak tidak ditemukan atau sudah dibayar.');
  }

  // Simpan riwayat pembayaran
  await prisma.taxPayment.create({
    data: {
      taxId: tax.id,
      paidAt: paidDate,
      notes: 'Dibayar lewat aplikasi e-Samsat'
    }
  });

  // Tandai pajak sebagai dibayar
  await prisma.tax.update({
    where: { id: tax.id },
    data: {
      isPaid: true,
      paidAt: paidDate
    }
  });

  // Jatuh tempo selanjutnya berdasarkan tanggal dibayar
  const nextDueDate = addYears(paidDate, tax.type === 'ANNUAL' ? 1 : 5);

  await prisma.tax.create({
    data: {
      carId: tax.carId,
      type: tax.type,
      dueDate: nextDueDate,
      isPaid: false
    }
  });

  console.log(
    'Pembayaran dicatat dan pajak berikutnya dibuat untuk tanggal ' +
      nextDueDate.toDateString()
  );

  return {
    success: true,
    nextDueDate
  };
};
