import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { purchaseFuelSchema } from '@/actions/fuel';
import { uploadNota } from '@/actions/keuangan';

interface PurchaseFuelBody {
  carId: string;
  fuelType: 'SOLAR' | 'BENSIN';
  amount: number; // jumlah uang yang dikeluarkan (expense)
  receiptFile?: File; // optional link/file nota
  date?: Date; // optional tanggal pembelian, default now
  notes?: string; // optional catatan
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const getString = (key: string): string | undefined => {
      const value = formData.get(key);
      const str = value?.toString().trim();
      return str ? str : undefined;
    };

    const getRequiredFile = (key: string): File => {
      const file = formData.get(key);
      if (!file || !(file instanceof File)) {
        throw new Error(`File ${key} is required`);
      }
      return file;
    };

    const getNumber = (key: string): number => {
      const value = formData.get(key);
      if (!value) throw new Error(`Field ${key} is required`);
      const number = Number(value);
      if (isNaN(number)) throw new Error(`Field ${key} must be a number`);
      return number;
    };

    const getDate = (key: string): Date | undefined => {
      const value = formData.get(key);
      if (!value) return undefined;
      console.log({ value });
      const date = new Date(value.toString());
      console.log({ date });
      if (isNaN(date.getTime())) {
        throw new Error(`Field ${key} must be a valid date`);
      }

      return date;
    };

    const data: PurchaseFuelBody = {
      carId: getString('carId')!, // Jika required, pakai `!` atau validasi di schema
      fuelType: getString('fuelType') as 'BENSIN' | 'SOLAR',
      amount: getNumber('amount'),
      receiptFile: getRequiredFile('receiptFile'),
      date: getDate('date'), // Optional
      notes: getString('notes') // Optional
    };

    const result = purchaseFuelSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Validation error',
          errors: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    const { data: body } = result;
    // return NextResponse.json({
    //   message: 'Upload berhasil',
    //   data: result.data
    // });
    // const body: PurchaseFuelBody = await request.json();
    //
    //
    // // Validasi sederhana
    // if (!body.carId) return NextResponse.json({ error: 'carId is required' }, { status: 400 });
    // if (!body.fuelType || !['SOLAR', 'BENSIN'].includes(body.fuelType)) {
    //     return NextResponse.json({ error: 'fuelType must be SOLAR or BENSIN' }, { status: 400 });
    // }
    // if (!body.amount || body.amount <= 0) {
    //     return NextResponse.json({ error: 'amount must be greater than zero' }, { status: 400 });
    // }
    //
    const purchaseDate = body.date ? new Date(body.date) : new Date(); // default: sekarang

    //
    let receiptFileUrl: string | undefined = undefined;
    if (body.receiptFile) {
      receiptFileUrl = await uploadNota(body.receiptFile);
    }

    const carName = await prisma.car.findUnique({ where: { id: body.carId } });
    if (!carName) {
      return NextResponse.json({ error: 'car notfound' }, { status: 400 });
    }

    // Buat transaksi pengeluaran (Cashflow)
    const cashflow = await prisma.cashflow.create({
      data: {
        type: 'EXPENSE',
        amount: body.amount,
        date: purchaseDate,
        description: `Pembelian ${body.fuelType} - mobil ${carName.name}`,
        fuelUsage: {
          create: {
            carId: body.carId,
            fuelType: body.fuelType,
            receiptFile: receiptFileUrl,
            notes: body.notes
          }
        }
      },
      include: {
        fuelUsage: true
      }
    });

    return NextResponse.json({ success: true, cashflow });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
