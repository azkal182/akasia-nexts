// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const initialPerizinanList = [
//   {
//     id: 1,
//     nama: "Ahmad Fauzi",
//     keperluan: "Acara Keluarga",
//     tujuan: "Bandung",
//     armada: "Toyota Avanza",
//     jumlahPenumpang: 5,
//     waktuPenggunaan: "2025-05-01",
//     estimasiPenggunaan: "2025-05-03",
//     status: "pending",
//   },
//   {
//     id: 2,
//     nama: "Siti Nurhaliza",
//     keperluan: "Wisata Sekolah",
//     tujuan: "Jakarta",
//     armada: "Toyota HiAce",
//     jumlahPenumpang: 12,
//     waktuPenggunaan: "2025-05-04",
//     estimasiPenggunaan: "2025-05-05",
//     status: "accepted",
//   },
//   {
//     id: 3,
//     nama: "Budi Santoso",
//     keperluan: "Kunjungan Kerja",
//     tujuan: "Yogyakarta",
//     armada: "Toyota Innova",
//     jumlahPenumpang: 4,
//     waktuPenggunaan: "2025-05-06",
//     estimasiPenggunaan: "2025-05-07",
//     status: "declined",
//   },
// ];

// const getStatusBadge = (status: string) => {
//   switch (status) {
//     case "pending":
//       return <Badge variant="secondary">Pending</Badge>;
//     case "accepted":
//       return (
//         <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>
//       );
//     case "declined":
//       return <Badge className="bg-red-500 hover:bg-red-600">Declined</Badge>;
//     default:
//       return <Badge>Unknown</Badge>;
//   }
// };

// export default function ListPerizinanMobil() {
//   const [perizinanList, setPerizinanList] = useState(initialPerizinanList);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [driverName, setDriverName] = useState("");

//   const handleOpenModal = (id: number) => {
//     setSelectedId(id);
//     setOpenModal(true);
//   };

//   const handleSubmit = () => {
//     if (!driverName.trim()) {
//       alert("Nama driver harus diisi!");
//       return;
//     }

//     const izin = perizinanList.find((i) => i.id === selectedId);
//     if (izin) {
//       console.log(`Driver ${driverName} berangkat untuk ${izin.nama}`);
//       alert(
//         `Driver ${driverName} berangkat membawa ${izin.armada} ke ${izin.tujuan}!`
//       );

//       // Contoh kalau mau update status atau data
//       // setPerizinanList((prev) =>
//       //   prev.map((i) =>
//       //     i.id === selectedId ? { ...i, status: "on_trip", driver: driverName } : i
//       //   )
//       // );
//     }

//     setDriverName("");
//     setSelectedId(null);
//     setOpenModal(false);
//   };

//   return (
//     <>
//       <Card className="p-6 mt-10 mx-auto max-w-7xl">
//         <h1 className="text-2xl font-bold mb-6 text-center">
//           Daftar Perizinan Membawa Mobil
//         </h1>

//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Nama</TableHead>
//                 <TableHead>Keperluan</TableHead>
//                 <TableHead>Tujuan</TableHead>
//                 <TableHead>Armada</TableHead>
//                 <TableHead>Jumlah Penumpang</TableHead>
//                 <TableHead>Waktu Penggunaan</TableHead>
//                 <TableHead>Estimasi Penggunaan</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Aksi</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {perizinanList.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{item.nama}</TableCell>
//                   <TableCell>{item.keperluan}</TableCell>
//                   <TableCell>{item.tujuan}</TableCell>
//                   <TableCell>{item.armada}</TableCell>
//                   <TableCell>{item.jumlahPenumpang}</TableCell>
//                   <TableCell>{item.waktuPenggunaan}</TableCell>
//                   <TableCell>{item.estimasiPenggunaan}</TableCell>
//                   <TableCell>{getStatusBadge(item.status)}</TableCell>
//                   <TableCell>
//                     <Button
//                       size="sm"
//                       className="bg-blue-500 hover:bg-blue-600"
//                       disabled={item.status !== "accepted"}
//                       onClick={() => handleOpenModal(item.id)}
//                     >
//                       Berangkat
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </Card>

//       {/* Modal */}
//       <Dialog open={openModal} onOpenChange={setOpenModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Masukkan Nama Driver</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-2">
//             <Label htmlFor="driverName">Nama Driver</Label>
//             <Input
//               id="driverName"
//               value={driverName}
//               onChange={(e) => setDriverName(e.target.value)}
//               placeholder="Contoh: Budi"
//             />
//           </div>

//           <DialogFooter className="mt-4">
//             <Button onClick={handleSubmit}>Submit</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Perizinan {
  id: number;
  name: string;
  purpose: string;
  destination: string;
  description?: string;
  carId: string;
  numberOfPassengers: number;
  date: string;
  estimation: number;
  status: "pending" | "accepted" | "declined";
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;
    case "APPROVED":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>
      );
    case "REJECTED":
      return <Badge className="bg-red-500 hover:bg-red-600">Declined</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

export default function ListPerizinanMobil() {
  const [data, setData] = useState<Perizinan[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Perizinan[]>("/api/perizinan");
        console.log(response.data);

        setData(response?.data?.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    const selected = data.find((item) => item.id === selectedId);
    if (!driverName.trim()) {
      alert("Nama driver wajib diisi");
      return;
    }

    if (selected) {
      alert(
        `Driver ${driverName} berangkat membawa kendaraan ${selected.carId} ke ${selected.destination}.`
      );
    }

    setDriverName("");
    setOpenModal(false);
    setSelectedId(null);
  };

  return (
    <>
      <Card className="p-6 mt-10 mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Daftar Perizinan Mobil
        </h1>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Armada</TableHead>
                <TableHead>Jumlah Penumpang</TableHead>
                <TableHead>Waktu Penggunaan</TableHead>
                <TableHead>Estimasi (hari)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.purpose}</TableCell>
                  <TableCell>{item.destination}</TableCell>
                  <TableCell>{item.car.name}</TableCell>
                  <TableCell>{item.numberOfPassengers}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.estimation} Hari</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={item.status !== "APPROVED"}
                      onClick={() => handleOpenModal(item.id)}
                    >
                      Berangkat
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal untuk driver */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan Nama Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="driverName">Nama Driver</Label>
            <Input
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Contoh: Pak Joko"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
