// import { auth } from '@/lib/auth';
// import { redirect } from 'next/navigation';

// export default async function Dashboard() {
//   const session = await auth();

//   if (!session?.user) {
//     return redirect('/');
//   } else {
//     redirect('/dashboard/overview');
//   }
// }

import { getReportData } from "@/actions/report";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toRupiah } from "@/lib/rupiah";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import ExportButton from "./export-button";

export default async function Home() {
  const data = await getReportData();
  console.log(JSON.stringify(data, null, 2));

  return (
    <div className="p-4">
      <Card className="p-8">
        <ExportButton />
        <Table>
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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.map((item: any, index) => (
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
                <TableCell>{item.debit ? toRupiah(item.debit) : "-"}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
