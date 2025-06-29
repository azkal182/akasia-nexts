'use server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import sharp from 'sharp';
// import fs from 'fs';
import { revalidatePath } from 'next/cache';
// import path from 'path';

interface Income {
  no: number;
  description: string;
  amount: number;
}

export const inputPemasukan = async (
  date: Date,
  incomes: Income[],
  userId: string
) => {
  try {
    // Hitung saldo terakhir
    const lastTransaction = await prisma.transaction.findFirst({
      orderBy: { date: 'desc' }
    });

    let previousBalance = lastTransaction?.balance ?? 0;

    // Loop untuk memproses setiap income
    for (const income of incomes) {
      const { amount, description } = income;
      const newBalance = previousBalance + amount;

      // Buat transaksi
      const transaction = await prisma.transaction.create({
        data: {
          date: new Date(date),
          description,
          credit: amount,
          debit: 0,
          balance: newBalance,
          userId
        }
      });

      // Catat pemasukan
      await prisma.income.create({
        data: {
          date: new Date(),
          amount,
          description,
          transactionId: transaction.id
        }
      });

      // Update previousBalance untuk transaksi berikutnya
      previousBalance = newBalance;
    }
    revalidatePath('/');

    console.log('Pemasukan berhasil dicatat.');
    return { message: 'Pemasukan berhasil dicatat.' };
  } catch (error) {
    console.error('Gagal mencatat pemasukan:', error);
  }
};

interface ItemInput {
  description: string;
  quantity: number;
  total: number;
  armada?: string;
}

// Fungsi untuk meng-upload file ke Supabase Storage
// const uploadNota = async (file: File): Promise<string> => {
//     try {
//         // Nama unik untuk file yang di-upload
//         const fileName = `nota-${Date.now()}${file.name.substring(file.name.lastIndexOf("."))}`;

//         // Mengonversi file menjadi buffer
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = new Uint8Array(arrayBuffer);

//         // Mengunggah file ke Supabase Storage
//         const { data, error } = await supabase.storage
//             .from("akasia") // Ganti dengan nama bucket Supabase kamu
//             .upload(`${fileName}`, buffer, {
//                 contentType: file.type,
//             });

//         if (error) {
//             console.error("Error meng-upload file:", error);
//             throw new Error("Gagal meng-upload file ke Supabase");
//         }

//         console.log("File berhasil di-upload ke Supabase:", data.path);

//         // Mendapatkan URL file yang diunggah
//         const { data: urlData } = supabase.storage
//             .from("akasia")
//             .getPublicUrl(data.path);

//         console.log("public path :", urlData.publicUrl);

//         return urlData.publicUrl;
//     } catch (error) {
//         console.error("Error meng-upload file:", error);
//         throw new Error("Gagal meng-upload file");
//     }
// };
export const uploadNota = async (file: File): Promise<string> => {
  try {
    // Nama unik untuk file yang di-upload
    const fileName = `nota-${Date.now()}.jpg`;

    // Kompresi gambar menggunakan Sharp langsung ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1024 }) // Resize jika lebih besar dari 1024px
      .jpeg({ quality: 70 }) // Kompres dengan kualitas 70%
      .toBuffer(); // Konversi langsung ke buffer

    // Upload langsung ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('akasia')
      .upload(fileName, compressedBuffer, {
        contentType: 'image/jpeg'
      });

    if (error) {
      console.error('Error meng-upload file:', error);
      throw new Error('Gagal meng-upload file ke Supabase');
    }

    // Mendapatkan URL file yang diunggah
    const publicUrl = supabase.storage.from('akasia').getPublicUrl(data.path)
      .data.publicUrl;
    console.log('Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error meng-upload file:', error);
    throw new Error('Gagal meng-upload file');
  }
};

export const inputPengeluaran = async (
  date: Date,
  note: string,
  items: ItemInput[],
  notaFile: File,
  userId: string
) => {
  try {
    // Upload file nota dan dapatkan path-nya
    const notaFilePath = await uploadNota(notaFile);

    // Hitung total pengeluaran
    const totalAmount = items.reduce((total, item) => {
      return total + item.quantity * item.total;
    }, 0);

    // Hitung saldo terakhir
    const lastTransaction = await prisma.transaction.findFirst({
      orderBy: { date: 'desc' }
    });
    const previousBalance = lastTransaction?.balance ?? 0;
    const newBalance = previousBalance - totalAmount;

    // Buat transaksi
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description: note,
        debit: totalAmount,
        credit: 0,
        balance: newBalance,
        userId
      }
    });

    // Catat pengeluaran
    const expense = await prisma.expense.create({
      data: {
        date: new Date(),
        total: totalAmount,
        notaFilePath, // Menyimpan path file nota
        transactionId: transaction.id
      }
    });

    // Catat item pengeluaran
    for (const item of items) {
      await prisma.item.create({
        data: {
          description: item.description,
          quantity: item.quantity,
          total: item.total,
          armada: item.armada,
          expenseId: expense.id
        }
      });
    }

    revalidatePath('/');
    console.log('Pengeluaran berhasil dicatat.');
    return { message: 'Pengeluaran berhasil dicatat.' };
  } catch (error) {
    console.error('Gagal mencatat pengeluaran:', error);
  }
};

export const laporanKeuangan = async () => {
  try {
    // Ambil semua transaksi
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'asc' }
    });

    console.log('Laporan Keuangan:');
    console.log('Tanggal\t\tKeterangan\t\tDebit\tCredit\tSaldo');
    console.log('------------------------------------------------------------');
    transactions.forEach((trx) => {
      console.log(
        `${trx.date.toISOString().split('T')[0]}\t${trx.description}\t${trx.debit}\t${trx.credit}\t${trx.balance}`
      );
    });
    // revalidatePath("/")
  } catch (error) {
    console.error('Gagal menampilkan laporan:', error);
  }
};

const getPengeluaranById = async (id: string) => {
  try {
    const data = await prisma.transaction.findUnique({
      where: { id },
      include: {
        expense: true
      }
    });
    if (!data) {
      throw new Error('tidak ada data');
    }

    return data;
  } catch (error) {
    throw new Error('Something went wrong!');
  }
};
