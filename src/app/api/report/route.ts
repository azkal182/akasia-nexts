// import { NextResponse } from "next/server";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";

import { NextResponse } from 'next/server';

// pdfMake.vfs = pdfFonts.vfs

// export async function GET() {
//     const transactions = [
//         {
//             transactionId: "2895768a-54bf-485f-a41e-2042ad70d59d",
//             date: "2025-02-24T17:32:13.007Z",
//             transactionDescription: "bulanan",
//             type: "income",
//             debit: 0,
//             credit: 4000000,
//             balance: 4000000,
//             itemDescription: null,
//             quantity: null,
//             total: 4000000,
//             armada: null,
//         },
//         {
//             transactionId: "9d995d28-4287-4e48-830b-9c867e84a270",
//             date: "2025-02-25T17:00:00.000Z",
//             transactionDescription: "",
//             type: "expense",
//             debit: 250000,
//             credit: null,
//             balance: 3750000,
//             itemDescription: "ban",
//             quantity: 1,
//             total: 250000,
//             armada: "KIJANG MERAH",
//         },
//         // Tambahkan transaksi lainnya
//     ];

//     const docDefinition = {
//         content: [
//             { text: "Laporan Keuangan", style: "header" },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ["15%", "15%", "20%", "15%", "10%", "10%", "15%"],
//                     body: [
//                         [
//                             "Tanggal",
//                             "Deskripsi",
//                             "Tipe",
//                             "Debit",
//                             "Kredit",
//                             "Saldo",
//                             "Armada",
//                         ],
//                         ...transactions.map((t) => [
//                             new Date(t.date).toLocaleDateString("id-ID"),
//                             t.transactionDescription || "-",
//                             t.type === "income" ? "Pemasukan" : "Pengeluaran",
//                             t.debit ? `Rp ${t.debit.toLocaleString("id-ID")}` : "-",
//                             t.credit ? `Rp ${t.credit.toLocaleString("id-ID")}` : "-",
//                             `Rp ${t.balance.toLocaleString("id-ID")}`,
//                             t.armada || "-",
//                         ]),
//                     ],
//                 },
//             },
//         ],
//         styles: {
//             header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
//         },
//     };

//     const pdfDoc = pdfMake.createPdf(docDefinition);
//     return new Promise((resolve) => {
//         pdfDoc.getBase64((data) => {
//             const response = new NextResponse(Buffer.from(data, "base64"), {
//                 headers: {
//                     "Content-Type": "application/pdf",
//                     "Content-Disposition": "attachment; filename=laporan.pdf",
//                 },
//             });
//             resolve(response);
//         });
//     });
// }

// import { getReportData } from "@/actions/report";
// import { format } from "date-fns";
// import { NextResponse } from "next/server";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import { id } from "date-fns/locale";
// pdfMake.vfs = pdfFonts.vfs;

// // Fungsi untuk mengambil gambar dari URL dan mengonversinya ke base64
// async function fetchImageAsBase64(url: string) {
//     try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Gagal mengunduh gambar: ${url}`);

//         const buffer = await response.arrayBuffer();
//         const base64 = Buffer.from(buffer).toString("base64");

//         // Tentukan tipe gambar (PNG atau JPG)
//         const mimeType = url.endsWith(".png") ? "image/png" : "image/jpeg";

//         return `data:${mimeType};base64,${base64}`;
//     } catch (error) {
//         console.error("Error fetching image:", error);
//         return null; // Jika gagal, kembalikan null agar tidak menyebabkan error
//     }
// }

// export const maxDuration = 60;
// export async function GET() {
//     const transactions = await getReportData()
//     console.log(JSON.stringify(transactions, null, 2));

//     // Hapus duplikasi berdasarkan transactionId
//     const uniqueTransactions = Object.values(
//         transactions.reduce((acc, transaction) => {
//             acc[transaction.transactionId] = transaction;
//             return acc;
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         }, {} as Record<string, any>)
//     );

//     // Unduh semua gambar dan ubah ke base64
//     for (const transaction of transactions) {
//         if (transaction.notaPath) {
//             transaction.notaBase64 = await fetchImageAsBase64(transaction.notaPath);
//         }
//     }

//     // **1. Halaman pertama: Laporan dalam bentuk tabel tanpa kolom Nota**
//     const reportTable = {
//         table: {
//             headerRows: 1,
//             widths: ["auto", "*", "*", "auto", "auto", "auto"],
//             body: [
//                 [
//                     { text: "Tanggal", bold: true },
//                     { text: "Deskripsi", bold: true },
//                     { text: "Armada", bold: true },
//                     { text: "Debit", bold: true },
//                     { text: "Credit", bold: true },
//                     { text: "Balance", bold: true }
//                 ],
//                 ...transactions.map((t) => [
//                     new Date(t.date).toLocaleDateString(),
//                     t.itemDescription ? t.itemDescription : t.transactionDescription,
//                     t.armada || "-",
//                     t.debit ? t.debit.toLocaleString() : "-",
//                     t.credit ? t.credit.toLocaleString() : "-",
//                     t.balance.toLocaleString()
//                 ])
//             ],
//         },
//         layout: "lightHorizontalLines",
//         margin: [0, 20, 0, 20],

//     };

//     // **2. Halaman berikutnya: Lampiran Nota**
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const pages: any[] = [
//         { text: "Laporan Keuangan AKASIA", style: "header", alignment: "center", margin: [0, 10, 0, 0] },
//         { text: format(new Date(), 'MMMM yyyy', { locale: id }), style: "header", alignment: "center", margin: [0, 5, 0, 20] },
//         reportTable,
//     ];
//     let firstLampiranAdded = false;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const expenseNotes = uniqueTransactions.filter((t: any) => t.type === "expense");
//     for (let i = 0; i < expenseNotes.length; i += 2) {
//         if (!firstLampiranAdded) {
//             pages.push({ text: "Lampiran Nota", style: "header", alignment: "center", margin: [0, 10, 0, 10], pageBreak: "before" });

//         }
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const nota1: any = expenseNotes[i];
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const nota2: any = expenseNotes[i + 1];

//         const pageContent = [
//             { text: `Tanggal: ${new Date(nota1.date).toLocaleDateString()}`, bold: true, margin: [0, 10, 0, 5], alignment: "center" },
//             { text: `Total: ${nota1.totalNota.toLocaleString()}`, bold: true, margin: [0, 0, 0, 10], alignment: "center" },
//             nota1.notaBase64
//                 ? { image: nota1.notaBase64, fit: [500, 280], alignment: "center", margin: [0, 5, 0, 20] }
//                 : { text: "Gambar tidak tersedia", color: "red", alignment: "center", margin: [0, 5, 0, 20] }
//         ];

//         if (nota2) {
//             pageContent.push(
//                 { text: `Tanggal: ${new Date(nota2.date).toLocaleDateString()}`, bold: true, margin: [0, 10, 0, 5], alignment: "center" },
//                 { text: `Total: ${nota2.totalNota.toLocaleString()}`, bold: true, margin: [0, 0, 0, 10], alignment: "center" },
//                 nota2.notaBase64
//                     ? { image: nota2.notaBase64, fit: [500, 280], alignment: "center", margin: [0, 5, 0, 20] }
//                     : { text: "Gambar tidak tersedia", color: "red", alignment: "center", margin: [0, 5, 0, 20] }
//             );
//         }
//         if (!firstLampiranAdded) {
//             pages.push({ stack: pageContent });
//             firstLampiranAdded = true;
//         } else {
//             pages.push({ stack: pageContent, pageBreak: "before" });
//         }
//     }

//     // Struktur PDF
//     const docDefinition = {
//         content: pages,
//         styles: {
//             header: { fontSize: 16, bold: true },
//         },
//     };

//     // Generate PDF
//     const pdfDoc = pdfMake.createPdf(docDefinition);
//     return new Promise<NextResponse>((resolve) => {
//         pdfDoc.getBase64((data) => {
//             const buffer = Buffer.from(data, "base64");
//             const uint8Array = new Uint8Array(buffer); // Konversi Buffer ke Uint8Array

//             resolve(
//                 new NextResponse(uint8Array, {
//                     status: 200,
//                     headers: {
//                         "Content-Type": "application/pdf",
//                         "Content-Disposition": "attachment; filename=report.pdf",
//                     },
//                 })
//             );
//         });
//     });

//     // return new Promise<NextResponse>((resolve) => {
//     //     pdfDoc.getBase64((data) => {
//     //         resolve(
//     //             new NextResponse(Buffer.from(data, "base64"), {
//     //                 status: 200,
//     //                 headers: {
//     //                     "Content-Type": "application/pdf",
//     //                     "Content-Disposition": "attachment; filename=report.pdf",
//     //                 },
//     //             })
//     //         );
//     //     });
//     // });
// }

import prisma from '@/lib/prisma';

async function getMonthlyCarExpensesPrisma(month: number, year: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Dapatkan semua mobil
  const cars = await prisma.car.findMany({
    select: { id: true, name: true, licensePlate: true }
  });

  // Hitung pengeluaran per mobil
  const reports = await Promise.all(
    cars.map(async (car) => {
      const expenses = await prisma.item.aggregate({
        where: {
          armada: { equals: car.name.trim() },
          expense: {
            date: { gte: startDate, lte: endDate }
          }
        },
        _sum: { total: true },
        _count: true
      });

      console.log(car.name.trim());

      return {
        carId: car.id,
        carName: car.name,
        licensePlate: car.licensePlate,
        totalExpenses: expenses._sum.total || 0,
        transactionCount: expenses._count
      };
    })
  );
  //   console.log({ reports });
  return reports.filter((report) => report.transactionCount > 0);
}

// Contoh penggunaan untuk Mei 2024
// getMonthlyCarExpenses(5, 2024).then(console.log).catch(console.error)
export async function GET() {
  //   const data = await prisma.transaction.findMany({
  //     include:{
  //         expense:{
  //             include:{ items:{include:{}}}
  //         }
  //     }
  //   });
  const data = await getMonthlyCarExpensesPrisma(6, 2025);
  return NextResponse.json({ data });
}
