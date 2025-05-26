import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma'; // pastikan prisma client tersedia

// Validasi input
const perizinanSchema = z.object({
    name: z.string().min(1),
    purpose: z.string().min(1),
    destination: z.string().min(1),
    description: z.string().optional(),
    numberOfPassengers: z.coerce.number().min(1),
    date: z.coerce.date(),
    estimation: z.coerce.number().min(1), // dalam hari
    carId: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = perizinanSchema.parse(body);

        const perizinan = await prisma.perizinan.create({
            data: {
                name: data.name,
                purpose: data.purpose,
                destination: data.destination,
                description: data.description,
                numberOfPassengers: data.numberOfPassengers,
                date: data.date,
                estimation: data.estimation,
                carId: data.carId,
            },
        });

        return NextResponse.json({ success: true, data: perizinan }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validasi gagal", errors: error.flatten() },
                { status: 400 }
            );
        }

        console.error("Error membuat perizinan:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const response = await prisma.perizinan.findMany({
            include: {
                car: true,
            },
        })


        return NextResponse.json({ success: true, data: response }, { status: 200 });
    } catch (error) {

        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}
