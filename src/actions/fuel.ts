import { CashflowType, FuelType } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// ---------------------
// Zod Schema untuk validasi input
// ---------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const receiveIncomeSchema = z.object({
  id: z.string().optional(),
  amount: z.coerce.number().int().positive(),
  source: z.string().optional().default('Yayasan'),
  date: z.coerce.date(),
  notes: z.string().optional()
});

export const purchaseFuelSchema = z.object({
  id: z.string().optional(),
  carId: z.string().uuid(),
  fuelType: z.enum([FuelType.BENSIN, FuelType.SOLAR]),
  amount: z.coerce.number().int().positive(),
  // receiptFile: z.string().optional(),
  receiptFile: z
    .instanceof(File, { message: 'Harus menyertakan bukti (receipt).' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Harap pilih gambar yang lebih kecil dari ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Harap unggah berkas gambar yang valid (JPEG, PNG, atau WebP).'
    }),
  notes: z.string().optional(),
  date: z.coerce.date()
});

export const getMonthlyReportSchema = z.object({
  year: z.number().int().min(2000),
  month: z.number().int().min(1).max(12)
});

// ---------------------
// Fungsi Prisma dengan input validasi Zod
// ---------------------

export async function receiveIncome(data: unknown) {
  const validated = receiveIncomeSchema.parse(data);
  const incomeDate = validated.date ? new Date(validated.date) : new Date(); // default: sekarang

  return await prisma.$transaction(async (tx) => {
    const cashflow = await tx.cashflow.create({
      data: {
        type: CashflowType.INCOME,
        amount: validated.amount,
        description: `Penerimaan dana dari ${validated.source}`,
        date: incomeDate,
        income: {
          create: {
            source: validated.source,
            notes: validated.notes
          }
        }
      },
      include: { income: true }
    });

    return cashflow;
  });
}

export async function purchaseFuel(data: unknown) {
  const validated = purchaseFuelSchema.parse(data);

  return await prisma.$transaction(async (tx) => {
    const cashflow = await tx.cashflow.create({
      data: {
        type: CashflowType.EXPENSE,
        amount: validated.amount,
        description: `Pembelian (${validated.fuelType}) - mobil ${validated.carId}`,
        fuelUsage: {
          create: {
            carId: validated.carId,
            fuelType: validated.fuelType,
            receiptFile: validated.receiptFile as unknown as string,
            notes: validated.notes
          }
        }
      },
      include: { fuelUsage: true }
    });

    return cashflow;
  });
}

type ReportItem = {
  date: Date;
  description: string | null;
  credit: number; // income
  debit: number; // expense
  runningBalance: number;
};

export async function getMonthlyReport(data: unknown): Promise<ReportItem[]> {
  const validated = getMonthlyReportSchema.parse(data);

  const startDate = new Date(validated.year, validated.month - 1, 1);
  const endDate = new Date(validated.year, validated.month, 0, 23, 59, 59);

  const transactions = await prisma.cashflow.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    orderBy: { date: 'asc' }
  });

  const incomeBefore = await prisma.cashflow.aggregate({
    where: { date: { lt: startDate }, type: CashflowType.INCOME },
    _sum: { amount: true }
  });
  const expenseBefore = await prisma.cashflow.aggregate({
    where: { date: { lt: startDate }, type: CashflowType.EXPENSE },
    _sum: { amount: true }
  });

  let runningBalance =
    (incomeBefore._sum.amount ?? 0) - (expenseBefore._sum.amount ?? 0);

  const report: ReportItem[] = [];

  for (const tx of transactions) {
    const credit = tx.type === CashflowType.INCOME ? tx.amount : 0;
    const debit = tx.type === CashflowType.EXPENSE ? tx.amount : 0;

    runningBalance += credit - debit;

    report.push({
      date: tx.date,
      description: tx.description,
      credit,
      debit,
      runningBalance
    });
  }

  return report;
}

function getLocalDate(year: number, month: number, day: number): Date {
  const utcDate = new Date(Date.UTC(year, month, day));
  // geser +7 jam ke depan
  utcDate.setUTCHours(utcDate.getUTCHours() - 7);
  return utcDate;
}
export async function getCashflowReport(year: number, month: number) {
  // const startDate = new Date(year, month - 1, 1);
  // const endDate = new Date(year, month, 1);
  const startDate = getLocalDate(year, month - 1, 1); // 1 Juni 00:00 WIB
  const endDate = getLocalDate(year, month, 1); // 1 Juli 00:00 WIB

  const records = await prisma.cashflow.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate
      }
    },
    include: {
      income: true,
      fuelUsage: true
    },
    orderBy: { date: 'asc' }
  });

  let runningBalance = 0;

  const report = records.map((item) => {
    const credit = item.type === 'INCOME' ? item.amount : 0;
    const debit = item.type === 'EXPENSE' ? item.amount : 0;

    runningBalance += credit - debit;

    return {
      id: item.id,
      date: item.date,
      description: item.description ?? null,
      notes: item.income?.notes ?? item.fuelUsage?.notes ?? null,
      credit: credit || null,
      debit: debit || null,
      runningBalance,
      receiptFile: item.type === 'EXPENSE' ? item.fuelUsage?.receiptFile : null
    };
  });

  return report;
}
