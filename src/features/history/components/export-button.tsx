'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { getReportData } from '@/actions/report';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { id } from 'date-fns/locale';
import { waterMark } from '@/constants/data';
import { RecordResponse } from '@/actions/usage-record';
pdfMake.vfs = pdfFonts.vfs;
const months = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 }
];
const ExportButton = ({
  disable = false,
  month,
  year
}: {
  disable: boolean;
  month: number;
  year: number;
}) => {
  const [loading, setLoading] = useState(false);
  async function fetchImageAsBase64(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Gagal mengunduh gambar: ${url}`);

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      // Tentukan tipe gambar (PNG atau JPG)
      const mimeType = url.endsWith('.png') ? 'image/png' : 'image/jpeg';

      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null; // Jika gagal, kembalikan null agar tidak menyebabkan error
    }
  }

  //   const generatePdf = async () => {
  //     setLoading(true);
  //     const res = await fetch('/api/usage-records', {
  //       method: 'GET'
  //     });

  //     if (!res.ok) {
  //       throw new Error('Gagal mengambil data laporan');
  //     }

  //     const transactions: RecordResponse[] = await res.json();

  //     // Hapus duplikasi berdasarkan transactionId
  //     const uniqueTransactions = Object.values(
  //       transactions.data.reduce(
  //         (acc, transaction) => {
  //           acc[transaction.transactionId] = transaction;
  //           return acc;
  //         },
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         {} as Record<string, any>
  //       )
  //     );

  //     // Unduh semua gambar dan ubah ke base64
  //     for (const transaction of transactions.data) {
  //       if (transaction.notaPath) {
  //         transaction.notaBase64 = await fetchImageAsBase64(transaction.notaPath);
  //       }
  //     }

  //     const totalPemasukan = transactions.data.reduce(
  //       (sum, t) => sum + (t.credit || 0),
  //       0
  //     );
  //     const totalPengeluaran = transactions.data.reduce(
  //       (sum, t) => sum + (t.debit || 0),
  //       0
  //     );

  //     // **1. Halaman pertama: Laporan dalam bentuk tabel tanpa kolom Nota**
  //     const reportTable = {
  //       table: {
  //         headerRows: 1,
  //         widths: ['auto', '*', '*', 'auto', 'auto', 'auto'],
  //         body: [
  //           [
  //             { text: 'Tanggal', bold: true },
  //             { text: 'Deskripsi', bold: true },
  //             { text: 'Armada', bold: true },
  //             { text: 'Masuk', bold: true },
  //             { text: 'Keluar', bold: true },
  //             { text: 'Saldo', bold: true }
  //           ],
  //           ...transactions.data.map((t) => [
  //             format(t.date, 'dd-MM-yyyy'),
  //             t.itemDescription ? t.itemDescription : t.transactionDescription,
  //             t.armada || '-',
  //             t.credit ? t.credit.toLocaleString() : '-',
  //             t.debit ? t.debit.toLocaleString() : '-',
  //             t.balance.toLocaleString()
  //           ]),
  //           [
  //             { text: 'Total', bold: true, colSpan: 3, alignment: 'right' },
  //             {},
  //             {},
  //             { text: totalPemasukan.toLocaleString(), bold: true },
  //             { text: totalPengeluaran.toLocaleString(), bold: true },
  //             {}
  //           ]
  //         ]
  //       },
  //       layout: 'lightHorizontalLines',
  //       margin: [0, 20, 0, 20]
  //     };

  //     // **2. Halaman berikutnya: Lampiran Nota**
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const pages: any[] = [
  //       {
  //         text: 'Laporan Keuangan AKASIA',
  //         style: 'header',
  //         alignment: 'center',
  //         margin: [0, 10, 0, 0]
  //       },
  //       {
  //         text: format(new Date(date.startDate), 'MMMM yyyy', { locale: id }),
  //         style: 'header',
  //         alignment: 'center',
  //         margin: [0, 5, 0, 20]
  //       },
  //       reportTable
  //     ];
  //     let firstLampiranAdded = false;
  //     const expenseNotes = uniqueTransactions.filter(
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       (t: any) => t.type === 'expense'
  //     );
  //     for (let i = 0; i < expenseNotes.length; i += 2) {
  //       if (!firstLampiranAdded) {
  //         pages.push({
  //           text: 'Lampiran Nota',
  //           style: 'header',
  //           alignment: 'center',
  //           margin: [0, 10, 0, 10],
  //           pageBreak: 'before'
  //         });
  //       }
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const nota1: any = expenseNotes[i];
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const nota2: any = expenseNotes[i + 1];

  //       const pageContent = [
  //         {
  //           text: `Tanggal: ${new Date(nota1.date).toLocaleDateString()}`,
  //           bold: true,
  //           margin: [0, 10, 0, 5],
  //           alignment: 'center'
  //         },
  //         {
  //           text: `Total: ${nota1.totalNota.toLocaleString()}`,
  //           bold: true,
  //           margin: [0, 0, 0, 10],
  //           alignment: 'center'
  //         },
  //         nota1.notaBase64
  //           ? {
  //               image: nota1.notaBase64,
  //               fit: [500, 280],
  //               alignment: 'center',
  //               margin: [0, 5, 0, 20]
  //             }
  //           : {
  //               text: 'Gambar tidak tersedia',
  //               color: 'red',
  //               alignment: 'center',
  //               margin: [0, 5, 0, 20]
  //             }
  //       ];

  //       if (nota2) {
  //         pageContent.push(
  //           {
  //             text: `Tanggal: ${new Date(nota2.date).toLocaleDateString()}`,
  //             bold: true,
  //             margin: [0, 10, 0, 5],
  //             alignment: 'center'
  //           },
  //           {
  //             text: `Total: ${nota2.totalNota.toLocaleString()}`,
  //             bold: true,
  //             margin: [0, 0, 0, 10],
  //             alignment: 'center'
  //           },
  //           nota2.notaBase64
  //             ? {
  //                 image: nota2.notaBase64,
  //                 fit: [500, 280],
  //                 alignment: 'center',
  //                 margin: [0, 5, 0, 20]
  //               }
  //             : {
  //                 text: 'Gambar tidak tersedia',
  //                 color: 'red',
  //                 alignment: 'center',
  //                 margin: [0, 5, 0, 20]
  //               }
  //         );
  //       }
  //       if (!firstLampiranAdded) {
  //         pages.push({ stack: pageContent });
  //         firstLampiranAdded = true;
  //       } else {
  //         pages.push({ stack: pageContent, pageBreak: 'before' });
  //       }
  //     }

  //     // Struktur PDF
  //     const docDefinition = {
  //       content: pages,
  //       styles: {
  //         header: { fontSize: 16, bold: true }
  //       },
  //       // watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
  //       background: function (currentPage, pageSize) {
  //         return {
  //           image: waterMark, // base64 dari gambar
  //           width: pageSize.width,
  //           opacity: 0.2
  //         };
  //       }
  //     };

  //     // Generate PDF
  //     // const pdfDoc = pdfMake.createPdf(docDefinition);
  //     const pdfDoc = pdfMake.createPdf(docDefinition);
  //     pdfDoc.download(
  //       `laporan-${format(date.startDate, 'MMMM-yyyy', { locale: id })}.pdf`
  //     );
  //     setLoading(false);
  //   };

  const generatePdf = async () => {
    setLoading(true);

    const res = await fetch(`/api/usage-records?month=${month}&year=${year}`, {
      method: 'GET'
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data laporan');
    }

    const transactions: RecordResponse[] = await res.json();

    // Susun data body tabel
    const body = [
      [
        { text: 'No', bold: true, alignment: 'center' },
        { text: 'Armada', bold: true, alignment: 'center' },
        { text: 'Keperluan', bold: true, alignment: 'center' },
        { text: 'Tujuan', bold: true, alignment: 'center' },
        { text: 'Mulai', bold: true, alignment: 'center' },
        { text: 'Selesai', bold: true, alignment: 'center' },
        { text: 'Driver', bold: true, alignment: 'center' }
      ],
      ...transactions.map((record, index) => [
        { text: index + 1, alignment: 'center' },
        { text: record.car?.name || '-', alignment: 'left' },
        { text: record.purpose, alignment: 'left' },
        { text: record.destination, alignment: 'left' },
        {
          text: format(new Date(record.startTime), 'dd/MM/yy - HH:mm'),
          alignment: 'center'
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          text: format(new Date(record.endTime as any), 'dd/MM/yy - HH:mm'),
          alignment: 'center'
        },
        { text: record.User?.name || '-', alignment: 'left' }
      ])
    ];

    // Definisi layout kustom untuk border
    const customLayout = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hLineWidth: function (i: number, node: any) {
        return 0.5;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vLineWidth: function (i: number, node: any) {
        return 0.5;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hLineColor: function (i: number, node: any) {
        return '#000000';
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vLineColor: function (i: number, node: any) {
        return '#000000';
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fillColor: function (i: number, node: any) {
        return i === 0 ? '#D3D3D3' : null; // Warna abu-abu untuk header
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paddingLeft: function (i: number, node: any) {
        return 5;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paddingRight: function (i: number, node: any) {
        return 5;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paddingTop: function (i: number, node: any) {
        return 3;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paddingBottom: function (i: number, node: any) {
        return 3;
      }
    };

    // Definisi PDF
    const docDefinition = {
      pageSize: { width: 595.28, height: 935.43 }, // Ukuran F4 dalam poin (210mm x 330mm)
      pageMargins: [30, 30, 30, 30], // Margin lebih besar untuk centering
      content: [
        {
          text: 'Laporan Penggunaan ARMADA AKASIA',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        {
          text: `Bulan ${months[month].label} Tahun ${year}`,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: [25, 80, 80, 80, 60, 60, 80], // Total 465, pas untuk F4
            body
          },
          layout: customLayout,
          alignment: 'center' // Pastikan tabel rata tengah
        }
      ],
      styles: {
        header: { fontSize: 16, bold: true, color: '#000000' }
      },
      background: function (currentPage, pageSize) {
        return {
          image: waterMark, // base64 dari gambar
          width: pageSize.width,
          opacity: 0.2
        };
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(`laporan-penggunaan-kendaraan.pdf`);
    setLoading(false);
  };
  return (
    <Button onClick={generatePdf} disabled={loading || disable}>
      {loading ? 'Membuat PDF...' : 'Unduh PDF'}
    </Button>
  );
};

export default ExportButton;
