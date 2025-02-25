"use server"
import prisma from "@/lib/prisma";
import { fromZonedTime } from "date-fns-tz";

export const getReportData = async ({ startDate, endDate, timeZone }: { startDate: Date, endDate: Date, timeZone: string }) => {
    console.log(startDate, endDate);

    const transactionsWithItems = await prisma.transaction.findMany({
        where: {
            date: {
                gte: fromZonedTime(startDate, timeZone),
                lte: fromZonedTime(endDate, timeZone)
            }
        },
        orderBy: { date: 'asc' },
        include: {
            expense: {
                include: {
                    items: {
                        select: {
                            id: true,
                            description: true,
                            armada: true,
                            quantity: true,
                            total: true,
                        },
                    },
                },
            },
            income: {  // Tambahkan ini agar income bisa diakses
                select: {
                    amount: true,
                },
            },
        },
    });


    let runningBalance = 0; // Untuk menyimpan saldo yang diperbarui
    // Format data agar setiap item memiliki informasi transaksi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = transactionsWithItems.flatMap((transaction: any) => {
        if (runningBalance === 0) {
            runningBalance = transaction.balance; // Set balance awal dari transaksi pertama
        }

        if (transaction.expense && transaction.expense.items.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return transaction.expense.items.map((item: any) => {
                runningBalance -= item.total; // Kurangi balance setiap kali item diproses

                return {
                    transactionId: transaction.id,
                    date: transaction.date,
                    transactionDescription: transaction.description,
                    type: "expense",
                    debit: item.total,
                    credit: null,
                    balance: runningBalance, // Balance diperbarui setelah setiap item
                    itemId: item.id,
                    itemDescription: item.description,
                    quantity: item.quantity,
                    total: item.total,
                    totalNota: transaction.debit,
                    notaPath: transaction.expense?.notaFilePath,
                    armada: item.armada ?? null,
                };
            });
        }
        runningBalance = transaction.balance
        // Jika transaksi adalah income, tambahkan tanpa mengubah balance
        return [{
            transactionId: transaction.id,
            date: transaction.date,
            transactionDescription: transaction.description,
            type: "income",
            debit: transaction.debit,
            credit: transaction.credit,
            balance: runningBalance, // Gunakan balance yang sudah diperbarui sebelumnya
            itemId: null,
            itemDescription: null,
            quantity: null,
            total: transaction.income?.amount ?? 0,
            armada: null,
        }];
    });



    // console.log(JSON.stringify(transactionsWithItems, null, 2));


    return formattedData
}
