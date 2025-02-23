import prisma from "@/lib/prisma";

export const getReportData = async () => {
    const transactionsWithItems = await prisma.transaction.findMany({
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

    // Format data agar setiap item memiliki informasi transaksi
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const formattedData = transactionsWithItems.flatMap((transaction) => {
        if (transaction.expense && transaction.expense.items.length > 0) {
            return transaction.expense.items.map((item) => ({
                transactionId: transaction.id,
                date: transaction.date,
                transactionDescription: transaction.description,
                type: "expense",
                debit: transaction.debit,
                credit: transaction.credit,
                balance: transaction.balance,
                itemId: item.id,
                itemDescription: item.description,
                quantity: item.quantity,
                total: item.total,
                notaPath: transaction.expense?.notaFilePath,
                armada: item.armada ?? null, // Armada bisa null
            }));
        }

        // Pastikan transaksi yang bukan `expense` tetap dikembalikan sebagai `income`
        return [{
            transactionId: transaction.id,
            date: transaction.date,
            transactionDescription: transaction.description,
            type: "income",
            debit: transaction.debit,
            credit: transaction.credit,
            balance: transaction.balance,
            itemId: null,
            itemDescription: null,
            quantity: null,
            total: transaction.income?.amount ?? 0, // Gunakan optional chaining dan default value
            armada: null,
        }];
    });


    console.log(JSON.stringify(transactionsWithItems, null, 2));


    return formattedData
}
