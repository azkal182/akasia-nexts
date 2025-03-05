"use server"
import prisma from "@/lib/prisma";
import { fromZonedTime } from "date-fns-tz";

export const getReportData = async ({ startDate, endDate, timeZone }: { startDate: Date, endDate: Date, timeZone: string }) => {
    // const offsetMs = 7 * 60 * 60 * 1000;
    // const utcStartDate = new Date(startDate.getTime() - offsetMs);
    // const utcEndDate = new Date(endDate.getTime() - offsetMs);

    // console.log('Local Jakarta (WIB):', startDate, endDate);
    // console.log('UTC:', utcStartDate, utcEndDate);


    const transactionsWithItems = await prisma.transaction.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: [
            { date: 'asc' },
            // { timeStamp: 'asc' }
        ],
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

    const previousBalance = await prisma.transaction.aggregate({
        _sum: {
            debit: true,  // Total pengeluaran (expense)
            credit: true, // Total pemasukan (income)
        },
        where: {
            date: {
                lt: startDate, // Ambil semua transaksi SEBELUM `startDate`
            },
        },
    });

    // Saldo awal dihitung dari total pemasukan - total pengeluaran sebelum `startDate`
    let runningBalance = (previousBalance._sum.credit || 0) - (previousBalance._sum.debit || 0);
    console.log("Saldo Awal:", runningBalance);
    console.log("Running Balance Before Processing:", runningBalance);


    // let runningBalance = 0; // Untuk menyimpan saldo yang diperbarui
    // Format data agar setiap item memiliki informasi transaksi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = transactionsWithItems.flatMap((transaction: any) => {
        // if (runningBalance === 0) {
        //     runningBalance = transaction.balance; // Set balance awal dari transaksi pertama
        // }

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
        runningBalance += transaction.credit
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
