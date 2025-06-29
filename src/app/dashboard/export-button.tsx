'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { getReportData } from '@/actions/report';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { id } from 'date-fns/locale';
import { waterMark } from '@/constants/data';
pdfMake.vfs = pdfFonts.vfs;

const ExportButton = ({
  disable = false,
  date
}: {
  disable: boolean;
  date: { startDate: Date; endDate: Date; timeZone: string };
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

  const generatePdf = async () => {
    setLoading(true);
    const transactions = await getReportData({
      startDate: date.startDate,
      endDate: date.endDate,
      timeZone: date.timeZone
    });

    // Hapus duplikasi berdasarkan transactionId
    const uniqueTransactions = Object.values(
      transactions.data.reduce(
        (acc, transaction) => {
          acc[transaction.transactionId] = transaction;
          return acc;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any>
      )
    );

    // Unduh semua gambar dan ubah ke base64
    for (const transaction of transactions.data) {
      if (transaction.notaPath) {
        transaction.notaBase64 = await fetchImageAsBase64(transaction.notaPath);
      }
    }

    const totalPemasukan = transactions.data.reduce(
      (sum, t) => sum + (t.credit || 0),
      0
    );
    const totalPengeluaran = transactions.data.reduce(
      (sum, t) => sum + (t.debit || 0),
      0
    );

    // **1. Halaman pertama: Laporan dalam bentuk tabel tanpa kolom Nota**
    const reportTable = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Tanggal', bold: true },
            { text: 'Deskripsi', bold: true },
            { text: 'Armada', bold: true },
            { text: 'Masuk', bold: true },
            { text: 'Keluar', bold: true },
            { text: 'Saldo', bold: true }
          ],
          ...transactions.data.map((t) => [
            format(t.date, 'dd-MM-yyyy'),
            t.itemDescription ? t.itemDescription : t.transactionDescription,
            t.armada || '-',
            t.credit ? t.credit.toLocaleString() : '-',
            t.debit ? t.debit.toLocaleString() : '-',
            t.balance.toLocaleString()
          ]),
          [
            { text: 'Total', bold: true, colSpan: 3, alignment: 'right' },
            {},
            {},
            { text: totalPemasukan.toLocaleString(), bold: true },
            { text: totalPengeluaran.toLocaleString(), bold: true },
            {}
          ]
        ]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 20, 0, 20]
    };

    // **2. Halaman berikutnya: Lampiran Nota**
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages: any[] = [
      {
        text: 'Laporan Keuangan AKASIA',
        style: 'header',
        alignment: 'center',
        margin: [0, 10, 0, 0]
      },
      {
        text: format(new Date(date.startDate), 'MMMM yyyy', { locale: id }),
        style: 'header',
        alignment: 'center',
        margin: [0, 5, 0, 20]
      },
      reportTable
    ];
    let firstLampiranAdded = false;
    const expenseNotes = uniqueTransactions.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (t: any) => t.type === 'expense'
    );
    for (let i = 0; i < expenseNotes.length; i += 2) {
      if (!firstLampiranAdded) {
        pages.push({
          text: 'Lampiran Nota',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 10],
          pageBreak: 'before'
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nota1: any = expenseNotes[i];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nota2: any = expenseNotes[i + 1];

      const pageContent = [
        {
          text: `Tanggal: ${new Date(nota1.date).toLocaleDateString()}`,
          bold: true,
          margin: [0, 10, 0, 5],
          alignment: 'center'
        },
        {
          text: `Total: ${nota1.totalNota.toLocaleString()}`,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        nota1.notaBase64
          ? {
              image: nota1.notaBase64,
              fit: [500, 280],
              alignment: 'center',
              margin: [0, 5, 0, 20]
            }
          : {
              text: 'Gambar tidak tersedia',
              color: 'red',
              alignment: 'center',
              margin: [0, 5, 0, 20]
            }
      ];

      if (nota2) {
        pageContent.push(
          {
            text: `Tanggal: ${new Date(nota2.date).toLocaleDateString()}`,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: 'center'
          },
          {
            text: `Total: ${nota2.totalNota.toLocaleString()}`,
            bold: true,
            margin: [0, 0, 0, 10],
            alignment: 'center'
          },
          nota2.notaBase64
            ? {
                image: nota2.notaBase64,
                fit: [500, 280],
                alignment: 'center',
                margin: [0, 5, 0, 20]
              }
            : {
                text: 'Gambar tidak tersedia',
                color: 'red',
                alignment: 'center',
                margin: [0, 5, 0, 20]
              }
        );
      }
      if (!firstLampiranAdded) {
        pages.push({ stack: pageContent });
        firstLampiranAdded = true;
      } else {
        pages.push({ stack: pageContent, pageBreak: 'before' });
      }
    }

    // Struktur PDF
    const docDefinition = {
      content: pages,
      styles: {
        header: { fontSize: 16, bold: true }
      },
      // watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
      background: function (currentPage, pageSize) {
        return {
          image: waterMark, // base64 dari gambar
          width: pageSize.width,
          opacity: 0.2
        };
      }
    };

    // Generate PDF
    // const pdfDoc = pdfMake.createPdf(docDefinition);
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(
      `laporan-${format(date.startDate, 'MMMM-yyyy', { locale: id })}.pdf`
    );
    setLoading(false);
  };

  return (
    <Button onClick={generatePdf} disabled={loading || disable}>
      {loading ? 'Membuat PDF...' : 'Unduh PDF'}
    </Button>
  );
};

export default ExportButton;
