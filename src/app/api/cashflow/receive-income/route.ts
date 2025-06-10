import { NextResponse } from 'next/server';
import { receiveIncome } from '@/actions/fuel';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await auth();
  try {
    const userId = user!.user!.id;
    const data = await request.json();
    const cashflow = await receiveIncome(data, userId);
    return NextResponse.json(cashflow);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
