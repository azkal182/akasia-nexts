"use server"
import prisma from "@/lib/prisma"
import fs from 'fs';
import { revalidatePath } from "next/cache";
import path from 'path';

interface Income {
    no: number;
    description: string;
    amount: number;
}

export const inputPemasukan = async (date: Date, incomes: Income[]) => {
    try {
        // Hitung saldo terakhir
        const lastTransaction = await prisma.transaction.findFirst({
            orderBy: { date: 'desc' },
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
                },
            });

            // Catat pemasukan
            await prisma.income.create({
                data: {
                    date: new Date(),
                    amount,
                    description,
                    transactionId: transaction.id,
                },
            });

            // Update previousBalance untuk transaksi berikutnya
            previousBalance = newBalance;
        }
        revalidatePath("/")

        console.log('Pemasukan berhasil dicatat.');
    } catch (error) {
        console.error('Gagal mencatat pemasukan:', error);
    }
};




interface ItemInput {
    description: string;
    quantity: number;
    total: number;
    armada?: string
}

// Fungsi untuk meng-handle upload file dan mendapatkan pathnya
const uploadNota = async (file: File): Promise<string> => {
    try {
        // Menyusun path penyimpanan file di server lokal
        const filePath = path.join('./public/uploads', `nota-${Date.now()}${path.extname(file.name)}`);

        // Mengonversi file menjadi buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Menyimpan file ke server lokal menggunakan fs
        await fs.promises.writeFile(filePath, buffer);

        console.log('File berhasil di-upload ke server di path:', filePath);

        return filePath.replace("public/", "")
    } catch (error) {
        console.error('Error meng-upload file:', error);
        throw new Error('Gagal meng-upload file');
    }
};

export const inputPengeluaran = async (date: Date, note: string, items: ItemInput[], notaFile: File) => {
    try {
        // Upload file nota dan dapatkan path-nya
        const notaFilePath = await uploadNota(notaFile);

        // Hitung total pengeluaran
        const totalAmount = items.reduce((total, item) => {
            return total + item.quantity * item.total;
        }, 0);

        // Hitung saldo terakhir
        const lastTransaction = await prisma.transaction.findFirst({
            orderBy: { date: 'desc' },
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
            },
        });

        // Catat pengeluaran
        const expense = await prisma.expense.create({
            data: {
                date: new Date(),
                total: totalAmount,
                notaFilePath, // Menyimpan path file nota
                transactionId: transaction.id,
            },
        });

        // Catat item pengeluaran
        for (const item of items) {
            await prisma.item.create({
                data: {
                    description: item.description,
                    quantity: item.quantity,
                    total: item.total,
                    armada: item.armada,
                    expenseId: expense.id,
                },
            });
        }

        revalidatePath("/")
        console.log('Pengeluaran berhasil dicatat.');
        return { message: 'Pengeluaran berhasil dicatat.' }
    } catch (error) {
        console.error('Gagal mencatat pengeluaran:', error);
    }
};


export const laporanKeuangan = async () => {
    try {
        // Ambil semua transaksi
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'asc' },
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
