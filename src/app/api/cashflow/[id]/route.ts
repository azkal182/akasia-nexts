// app/api/cashflow/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // pastikan path ke prisma client benar

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Pastikan id bisa dikonversi ke number jika id-nya integer
    const deleted = await prisma.cashflow.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({
      message: 'Data berhasil dihapus',
      data: deleted
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Gagal menghapus data',
        error: error?.message || 'Terjadi kesalahan'
      },
      { status: 500 }
    );
  }
}
