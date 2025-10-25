import { NextResponse } from 'next/server';
import {
  getCashflowReport,
  getCashflowReportByHijri,
  receiveIncome
} from '@/actions/fuel'; // Pastikan fungsi ini sudah dibuat di lib/actions
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    if (!yearParam || !monthParam) {
      return NextResponse.json(
        { error: 'year and month query parameters are required' },
        { status: 400 }
      );
    }

    const year = parseInt(yearParam, 10);
    const month = parseInt(monthParam, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Invalid year or month' },
        { status: 400 }
      );
    }

    // Ambil data laporan dari fungsi lib/actions
    // const report = await getCashflowReport(year, month);
    console.log({ year, month });

    const report = await getCashflowReportByHijri({
      hijriYear: year,
      hijriMonth: month
    });

    return NextResponse.json(report);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  try {
    const data = await request.json();
    const cashflow = await receiveIncome(data, session!.user!.id!);
    return NextResponse.json(cashflow);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
