import { NextResponse } from 'next/server';
import {receiveIncome} from "@/actions/fuel";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const cashflow = await receiveIncome(data);
        return NextResponse.json(cashflow);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }
}
