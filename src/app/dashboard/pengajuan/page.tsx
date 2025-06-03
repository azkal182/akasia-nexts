import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPengajuan } from "@/actions/pengajuan-dana";
import PengajuanPDF from "./generatePdf";
import PageContainer from "@/components/layout/page-container";
import Link from "next/link";
import DeleteButton from "./deleteButton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function PengajuanList() {
  const pengajuanList = await getPengajuan();

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-2xl font-bold mb-6">Riwayat Pengajuan</p>
          <Button asChild>
            <Link href={"/dashboard/pengajuan/create"}>Tambah</Link>
          </Button>
        </div>

        {pengajuanList.length === 0 ? (
          <p className="text-gray-600 text-center">
            Belum ada pengajuan yang dibuat.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pengajuanList.map((pengajuan) => (
              <Card key={pengajuan.id} className="bg-card">
                <CardHeader className="bg-card-foreground rounded-t-lg p-4">
                  <CardTitle className="text-lg font-semibold text-card">
                    📅 {format(new Date(pengajuan.date), "PP", { locale: id })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Tabel tanpa border untuk kebutuhan */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                      <tbody>
                        {pengajuan.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-b last:border-b-0"
                          >
                            <td className="py-2 px-4 text-center">
                              {index + 1}
                            </td>
                            <td className="py-2 px-4">{item.requirement}</td>
                            <td className="py-2 px-4">{item.car.name}</td>
                            <td className="py-2 px-4 text-right text-green-600 font-semibold text-nowrap">
                              Rp {item.estimation.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t">
                          <td
                            className="py-2 px-4 font-semibold text-right"
                            colSpan={3}
                          >
                            Total
                          </td>
                          <td className="py-2 px-4 text-right text-green-600 font-bold text-nowrap">
                            Rp{" "}
                            {pengajuan.items
                              .reduce((acc, item) => acc + item.estimation, 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Tombol Download PDF */}
                  <div className="mt-4 flex justify-end gap-4">
                    <DeleteButton id={pengajuan.id} />
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <PengajuanPDF pengajuan={pengajuan} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
