"use client";
import { DatePickerDemo } from "@/components/date-picker-demo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inputPengeluaran } from "@/actions/keuangan";
import { toast } from "sonner";
import PageContainer from "@/components/layout/page-container";

interface Item {
  no: number;
  description: string;
  armada: string;
  quantity: number;
  total: number;
}

const armadaList = [
  { id: "truck-1", name: "INNOVA" },
  { id: "truck-2", name: "KIJANG MERAH" },
  { id: "truck-3", name: "L300" },
  { id: "bus-1", name: "LONG" },
];

const PengeluaranPage = () => {
  const [invoices, setInvoices] = useState<Item[]>([]);
  const [newDescription, setNewDescription] = useState<string>("");
  const [newArmada, setNewArmada] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newTotal, setNewTotal] = useState<number>(0);
  const [isTotalFocused, setIsTotalFocused] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [pending, setPending] = useState(false);
  const [newNota, setNewNota] = useState<File | null>(null);
  const [newArmadaName, setNewArmadaName] = useState<string>("");

  const handleArmadaChange = (id: string) => {
    setNewArmada(id);
    const selected = armadaList.find((item) => item.id === id);
    setNewArmadaName(selected ? selected.name : "");
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  function sumTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddInvoice = () => {
    const newInvoice: Item = {
      no: invoices.length + 1,
      description: newDescription,
      armada: newArmadaName,
      quantity: newQuantity,
      total: newTotal,
    };

    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
    setNewDescription("");
    setNewArmada("");
    setNewArmadaName("");
    setNewQuantity(1);
    setNewTotal(0);
    // setNewNota(null); // Reset file nota setelah menambahkannya
  };

  const handleDeleteInvoice = (no: number) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.no !== no)
    );
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    setNewTotal(numericValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Mendapatkan file pertama jika ada
    setNewNota(file); // Menyimpan file nota yang dipilih
  };

  const handleSubmit = async () => {
    if (pending) return; // Mencegah double submit
    setPending(true);

    if (newDescription !== "" || newArmada !== "" || newTotal !== 0) {
      toast("Tombol tambah belum ditekan atau hapus isian", {
        position: "top-right",
      });
      setPending(false); // Kembalikan false jika gagal
      return;
    }

    if (newNota === null) {
      toast("Nota belum ada", { position: "top-right" });
      setPending(false); // Kembalikan false jika gagal
      return;
    }

    toast.promise(
      inputPengeluaran(selectedDate as Date, newDescription, invoices, newNota),
      {
        position: "top-right",
        loading: "Menyimpan...",
        success: (data) => {
          setPending(false);
          setInvoices([]);
          return data?.message;
        },
        error: () => {
          setPending(false);
          return "Gagal mencatat pengeluaran";
        },
      }
    );
  };

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <Card className="p-4">
          <h1 className="text-center font-bold text-xl">Pengeluaran AKASIA</h1>
          <div>
            <Label>Tanggal</Label>
            <div className="mt-2 w-full md:w-60">
              <DatePickerDemo
                defaultDate={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <Label>Keterangan</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Label>Armada</Label>
              <Select value={newArmada} onValueChange={handleArmadaChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih armada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Armada</SelectLabel>
                    {armadaList.map((armada) => (
                      <SelectItem key={armada.id} value={armada.id}>
                        {armada.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Jumlah</Label>
              <Input
                inputMode="numeric"
                className="w-full"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
              />
            </div>
            <div className="md:col-span-3">
              <Label>Total</Label>
              <Input
                inputMode="numeric"
                type="text"
                value={
                  isTotalFocused
                    ? newTotal === 0
                      ? ""
                      : newTotal.toString()
                    : formatCurrency(newTotal)
                }
                onChange={handleTotalChange}
                onFocus={() => setIsTotalFocused(true)}
                onBlur={() => setIsTotalFocused(false)}
                placeholder="Masukkan total"
              />
            </div>

            {/* Input untuk upload nota */}
            <div className="md:col-span-3">
              <Label>Nota</Label>
              <Input type="file" onChange={handleFileChange} accept="image/*" />
              {newNota && <p className="mt-2 text-sm">{newNota.name}</p>}
            </div>

            <Button
              disabled={newDescription === "" || newTotal === 0}
              type="submit"
              className="mt-auto"
              onClick={handleAddInvoice}
            >
              Tambah
            </Button>
          </div>

          {/* Tabel */}
          <div className="mt-4">
            <Table>
              <TableCaption>Daftar pengeluaran terbaru.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Armada</TableHead>
                  <TableHead className="w-32 text-center">Jumlah</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.no}>
                      <TableCell>{invoice.no}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{invoice.armada}</TableCell>
                      <TableCell className="text-center">
                        {invoice.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size={"sm"}
                          onClick={() => handleDeleteInvoice(invoice.no)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(sumTotal(invoices))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={pending || invoices.length === 0}
                onClick={handleSubmit}
              >
                {pending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PengeluaranPage;
