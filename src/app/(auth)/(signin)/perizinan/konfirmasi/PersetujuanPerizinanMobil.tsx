"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface FormulirData {
  nama: string;
  keperluan: string;
  tujuan: string;
  armada: string;
  jumlahPenumpang: number;
  waktuPenggunaan: string;
  estimasiPenggunaan: string;
}

export default function PersetujuanPerizinanMobil({
  data,
}: {
  data: FormulirData;
}) {
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">(
    "pending"
  );
  const [alasanTolak, setAlasanTolak] = useState("");

  function handleAccept() {
    setStatus("accepted");
    alert("Permohonan diterima!");
    // di sini kamu bisa kirim API call untuk mengupdate status
  }

  function handleReject() {
    if (!alasanTolak) {
      alert("Harap isi alasan penolakan.");
      return;
    }
    setStatus("rejected");
    alert(`Permohonan ditolak. Alasan: ${alasanTolak}`);
    // di sini kamu juga bisa kirim API call untuk update status dengan alasan
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Persetujuan Perizinan Mobil
      </h1>

      <div className="space-y-4">
        <div>
          <Label>Nama</Label>
          <Input value={data.nama} disabled />
        </div>

        <div>
          <Label>Keperluan</Label>
          <Input value={data.keperluan} disabled />
        </div>

        <div>
          <Label>Tujuan</Label>
          <Input value={data.tujuan} disabled />
        </div>

        <div>
          <Label>Armada</Label>
          <Input value={data.armada} disabled />
        </div>

        <div>
          <Label>Jumlah Penumpang</Label>
          <Input value={data.jumlahPenumpang.toString()} disabled />
        </div>

        <div>
          <Label>Waktu Penggunaan</Label>
          <Input value={data.waktuPenggunaan} disabled />
        </div>

        <div>
          <Label>Estimasi Penggunaan</Label>
          <Input value={data.estimasiPenggunaan} disabled />
        </div>

        {status === "pending" && (
          <div className="flex gap-4 mt-4">
            <Button className="flex-1" onClick={handleAccept}>
              Accept
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={handleReject}
            >
              Decline
            </Button>
          </div>
        )}

        {status === "accepted" && (
          <p className="text-green-600 font-semibold text-center">
            Permohonan DITERIMA
          </p>
        )}
        {status === "rejected" && (
          <p className="text-red-600 font-semibold text-center">
            Permohonan DITOLAK
          </p>
        )}
      </div>
    </Card>
  );
}
