import React from "react";
import PersetujuanPerizinanMobil from "./PersetujuanPerizinanMobil";

const page = () => {
  const dummyData = {
    nama: "Ahmad Fauzi",
    keperluan: "Acara keluarga",
    tujuan: "Bandung",
    armada: "Toyota Avanza",
    jumlahPenumpang: 5,
    waktuPenggunaan: "2025-05-01",
    estimasiPenggunaan: "2025-05-03",
  };
  return (
    <div>
      <PersetujuanPerizinanMobil data={dummyData} />
    </div>
  );
};

export default page;
