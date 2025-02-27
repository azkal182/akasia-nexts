"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import PageContainer from "@/components/layout/page-container";
import ExportButton from "./export-button";
import { getReportData } from "@/actions/report";
import { toRupiah } from "@/lib/rupiah";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import MonthYearSelect from "@/components/month-year-select";
import { toZonedTime } from "date-fns-tz";

export default function Home() {
  const searchParams = useSearchParams();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Date();

  // Default startDate dan endDate (awal dan akhir bulan ini)
  const defaultStartDate = toZonedTime(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    timeZone
  );
  const defaultEndDate = toZonedTime(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    timeZone
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const isFirstRender = useRef(true); // Gunakan useRef untuk melacak render awal

  useEffect(() => {
    const fetchData = async () => {
      const startDateRaw = searchParams.get("startDate");
      const endDateRaw = searchParams.get("endDate");

      const newStartDate = startDateRaw
        ? toZonedTime(new Date(startDateRaw), timeZone)
        : defaultStartDate;
      const newEndDate = endDateRaw
        ? toZonedTime(new Date(endDateRaw), timeZone)
        : defaultEndDate;

      // Perbarui state hanya jika tanggal berbeda
      if (
        newStartDate.getTime() !== startDate.getTime() ||
        newEndDate.getTime() !== endDate.getTime()
      ) {
        if (!isNaN(newStartDate.getTime())) setStartDate(newStartDate);
        if (!isNaN(newEndDate.getTime())) setEndDate(newEndDate);
      }

      // Fetch data dengan tanggal yang sudah diperbarui
      setLoading(true);
      try {
        const reportData = await getReportData({
          startDate: newStartDate,
          endDate: newEndDate,
          timeZone,
        });
        setData(reportData);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Jalankan fetchData pada render pertama atau saat searchParams berubah
    if (isFirstRender.current || searchParams.toString()) {
      fetchData();
      isFirstRender.current = false; // Tandai bahwa render awal sudah selesai
    }
  }, [searchParams, timeZone]); // Bergantung pada searchParams dan timeZone

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        {/* <div className="overflow-x-auto w-[calc(100vw-16px)] md:w-full "> */}
        <Card className="p-4 md:p-8 min-h-60 max-w-[calc(100vw-2rem)] md:max-w-full">
          <div className="flex items-start justify-between">
            <ExportButton
              disable={data.length === 0}
              date={{
                startDate: startDate,
                endDate: endDate,
                timeZone: timeZone,
              }}
            />
            <MonthYearSelect
              searchParams={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
          </div>
          {loading ? (
            <div className="min-h-60 flex mt-4">
              <DataTableSkeleton columnCount={8} rowCount={5} />
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Armada</TableHead>
                    <TableHead>Pemasukan</TableHead>
                    <TableHead>Pengeluaran</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data?.map((item, index: number) => (
                      <TableRow
                        key={index}
                        className={
                          item.credit
                            ? "bg-green-100 hover:bg-green-200 dark:bg-green-950 dark:hover:bg-green-900"
                            : ""
                        }
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {format(item.date, "PPP", { locale: id })}
                        </TableCell>
                        <TableCell>
                          {item.transactionDescription
                            ? item.transactionDescription
                            : item.itemDescription}
                        </TableCell>
                        <TableCell>{item.armada}</TableCell>
                        <TableCell>
                          {item.credit ? toRupiah(item.credit) : "-"}
                        </TableCell>
                        <TableCell>
                          {item.debit ? toRupiah(item.debit) : "-"}
                        </TableCell>
                        <TableCell>{toRupiah(item.balance)}</TableCell>
                        <TableCell>
                          {item.notaPath ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm">Lihat</Button>
                              </DialogTrigger>
                              <DialogContent className="p-6 max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogTitle>Nota</DialogTitle>
                                <div className="flex items-center justify-center">
                                  <Image
                                    src={item.notaPath}
                                    alt="Nota"
                                    width={350}
                                    height={350}
                                    className="rounded-lg"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Tidak ada Data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
        {/* </div> */}
      </div>
    </PageContainer>
  );
}
