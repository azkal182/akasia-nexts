"use client";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";

pdfMake.vfs = pdfFonts.vfs;

type Pengajuan = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  date: any;
  items: {
    id: string;
    requirement: string;
    car: { id: string; name: string };
    estimation: number;
    imageUrl?: string;
  }[];
};

interface PengajuanPDFProps {
  pengajuan: Pengajuan;
}

export default function PengajuanPDF({ pengajuan }: PengajuanPDFProps) {
  const [loading, setLoading] = useState(false);
  // **🔹 Fungsi untuk Mengonversi URL ke Base64**
  const fetchImageBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Gagal mengunduh gambar:", error);
      return null;
    }
  };

  // **🔹 Fungsi untuk Membuat PDF**
  const generatePDF = async () => {
    setLoading(true);
    const { date, items } = pengajuan;
    console.log("Items:", items);

    // **🔹 Unduh semua gambar dan konversi ke base64**
    const imageBase64List = await Promise.all(
      items.map(async (item) => {
        if (!item.imageUrl) return null;
        const base64 = await fetchImageBase64(item.imageUrl);
        return base64 ? { base64, description: item.requirement } : null;
      })
    );

    // **🔹 Filter gambar yang berhasil diunduh**
    const validImages = imageBase64List.filter((img) => img !== null) as {
      base64: string;
      description: string;
    }[];

    console.log("Valid Images:", validImages);

    // **🔹 Buat halaman lampiran dengan gambar (6 gambar per halaman)**
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lampiranPages: (object | any)[] = [];

    for (let i = 0; i < validImages.length; i += 6) {
      const imageRow = validImages.slice(i, i + 6);

      // **Pisahkan ke halaman baru sebelum lampiran**
      lampiranPages.push({ text: "", pageBreak: "before" });

      // **Judul Lampiran**
      lampiranPages.push({
        text: "LAMPIRAN",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
        alignment: "center",
      });

      // **Tabel gambar**
      const imagesGrid = {
        table: {
          widths: ["50%", "50%"],
          body: [],
        },
        layout: "noBorders",
      };

      // **Tambah gambar dalam format 2 kolom x 3 baris**
      for (let j = 0; j < imageRow.length; j += 2) {
        const row = imageRow.slice(j, j + 2).map((img) => ({
          image: img.base64,
          fit: [250, 150],
          alignment: "center",
        }));

        const descriptionRow = imageRow.slice(j, j + 2).map((img) => ({
          text: img.description,
          alignment: "center",
          margin: [0, 5],
        }));

        // **Jika jumlah gambar dalam satu baris ganjil, tambahkan sel kosong**
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (row.length === 1) row.push({});
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (descriptionRow.length === 1) descriptionRow.push({ text: "" });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        imagesGrid.table.body.push(row);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        imagesGrid.table.body.push(descriptionRow);
      }

      lampiranPages.push(imagesGrid);
    }

    // **🔹 Definisi Dokumen PDF**
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: "FORMULIR PENGAJUAN DANA",
          style: "header",
          alignment: "center",
        },
        {
          text: "PONDOK PESANTREN DARUL FALAH",
          style: "subheader",
          alignment: "center",
        },

        {
          text: "I. IDENTITAS PENGAJU",
          style: "sectionHeader",
          margin: [0, 20, 0, 5],
        },
        {
          table: {
            widths: ["30%", "70%"],
            body: [
              [{ text: "Nama Departemen", bold: true }, { text: ": AKASIA" }],
              [{ text: "Nama Pengaju", bold: true }, { text: ": M. AZIZ" }],
              [{ text: "Jabatan", bold: true }, { text: ": KETUA AKASIA" }],
            ],
          },
          layout: "noBorders",
          margin: [20, 0],
        },

        {
          text: "II. RINCIAN PENGAJUAN DANA",
          style: "sectionHeader",
          margin: [0, 20, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ["10%", "40%", "25%", "25%"],
            body: [
              [
                { text: "No", style: "tableHeader" },
                { text: "Kebutuhan", style: "tableHeader" },
                { text: "Armada", style: "tableHeader" },
                { text: "Estimasi Biaya (Rp)", style: "tableHeader" },
              ],
              ...items.map((item, index) => [
                { text: index + 1, alignment: "center" },
                { text: item.requirement },
                { text: item.car.name },
                {
                  text: `Rp ${item.estimation.toLocaleString()}`,
                  alignment: "right",
                },
              ]),
            ],
          },
        },

        {
          text: `Total Estimasi Biaya: Rp ${items
            .reduce((acc, curr) => acc + curr.estimation, 0)
            .toLocaleString()}`,
          margin: [20, 10],
          bold: true,
          alignment: "right",
        },

        {
          text: "III. ALASAN PENGAJUAN",
          style: "sectionHeader",
          margin: [0, 20, 0, 5],
        },
        {
          text: "\u200B\tMobil pondok merupakan sarana penting dalam menunjang kegiatan operasional pesantren. Untuk menjaga keamanan dan performa kendaraan, diperlukan perawatan rutin seperti servis berkala dan penggantian ban yang sudah aus. Oleh karena itu, kami mengajukan permohonan dana guna mendukung kelancaran aktivitas pesantren.",
          margin: [20, 0],
          alignment: "justify",
        },

        { text: "IV. CATATAN", style: "sectionHeader", margin: [0, 20, 0, 5] },
        {
          text: "\u200B\tSetelah pengajuan disetujui, harap menyertakan bukti transaksi dalam bentuk nota/faktur resmi untuk pencatatan keuangan.",
          margin: [20, 0],
          alignment: "justify",
        },
        {
          table: {
            widths: ["50%", "50%"],
            body: [
              [
                "",
                {
                  text: `Darul Falah, ${format(new Date(date), "PPPP", {
                    locale: id,
                  })}`,
                  alignment: "center",
                  margin: [0, 30, 0, 0],
                },
              ],
              [
                "",
                {
                  text: "Sekretariat Pondok Pesantren Darul Falah",
                  alignment: "center",
                },
              ],
            ],
          },
          layout: "noBorders",
        },

        ...lampiranPages, // **Tambahkan halaman lampiran di bagian akhir**
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        subheader: { fontSize: 14, bold: true },
        sectionHeader: { fontSize: 12, bold: true },
        tableHeader: { bold: true, fillColor: "#dddddd", alignment: "center" },
      },
    };

    pdfMake.createPdf(docDefinition).download(`Pengajuan_${pengajuan.id}.pdf`);
    setLoading(false);
  };

  return (
    <Button disabled={loading} onClick={generatePDF}>
      {loading ? "loading..." : "Download PDF"}
    </Button>
  );
}
