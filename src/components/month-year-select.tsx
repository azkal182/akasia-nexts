// "use client";

// import { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useRouter } from "next/navigation";

// type MonthOption = {
//   label: string;
//   value: string;
// };

// type Props = {
//   searchParams: { startDate?: string; endDate?: string };
// };

// export default function MonthYearSelect({ searchParams }: Props) {
//   const router = useRouter();

//   const generateMonthOptions = (): MonthOption[] => {
//     const options: MonthOption[] = [];
//     const startDate = new Date(2025, 0, 1); // Januari 2025
//     const endDate = new Date(); // Tanggal sekarang (Feb 2025)

//     let current = new Date(startDate);
//     while (current <= endDate) {
//       const month = current.toLocaleString("id-ID", { month: "long" });
//       const year = current.getFullYear();
//       const value = `${year}-${current.getMonth().toString().padStart(2, "0")}`;
//       options.push({
//         label: `${month} ${year}`,
//         value: value,
//       });
//       current = new Date(current.setMonth(current.getMonth() + 1));
//     }
//     return options;
//   };

//   const monthOptions = generateMonthOptions();

//   const currentMonth =
//     new Date().getFullYear() +
//     "-" +
//     new Date().getMonth().toString().padStart(2, "0");

//   const getInitialValue = () => {
//     if (searchParams.startDate) {
//       const date = new Date(searchParams.startDate);
//       return `${date.getFullYear()}-${date
//         .getMonth()
//         .toString()
//         .padStart(2, "0")}`;
//     }
//     return currentMonth;
//   };

//   const [selectedMonth, setSelectedMonth] = useState(getInitialValue());

//   const formatDate = (date: Date): string => {
//     return date.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     const [year, month] = selectedMonth.split("-");
//     const startOfMonth = new Date(parseInt(year), parseInt(month), 1);
//     const endOfMonth = new Date(parseInt(year), parseInt(month) + 1, 0);

//     const params = new URLSearchParams();
//     params.set("startDate", formatDate(startOfMonth));
//     params.set("endDate", formatDate(endOfMonth));

//     router.push(`?${params.toString()}`, { scroll: false });
//   }, [selectedMonth, router]);

//   const handleMonthSelect = (value: string) => {
//     setSelectedMonth(value);
//     const [year, month] = value.split("-");
//     const selectedDate = new Date(parseInt(year), parseInt(month));

//     const startOfMonth = new Date(
//       selectedDate.getFullYear(),
//       selectedDate.getMonth(),
//       1
//     );
//     const endOfMonth = new Date(
//       selectedDate.getFullYear(),
//       selectedDate.getMonth() + 1,
//       0
//     );

//     console.log("Tanggal Awal:", startOfMonth.toLocaleDateString("id-ID"));
//     console.log("Tanggal Akhir:", endOfMonth.toLocaleDateString("id-ID"));
//   };

//   return (
//     <Select value={selectedMonth} onValueChange={handleMonthSelect}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent>
//         {monthOptions.map((option) => (
//           <SelectItem key={option.value} value={option.value}>
//             {option.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type MonthOption = {
  label: string;
  value: string;
};

type Props = {
  searchParams: { startDate?: string; endDate?: string };
};

export default function MonthYearSelect({ searchParams }: Props) {
  const router = useRouter();
  const timeZone = "Asia/Jakarta"; // Zona waktu lokal

  // Fungsi untuk menghasilkan opsi bulan dari Januari 2025 hingga bulan sekarang
  const generateMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = [];
    const startDate = toZonedTime(new Date(2025, 0, 1), timeZone);
    const endDate = toZonedTime(new Date(), timeZone);

    let current = startDate;
    while (current <= endDate) {
      const month = format(current, "MMMM", { locale: undefined });
      const year = format(current, "yyyy");
      const monthIndex = format(current, "MM"); // Pastikan format 2 digit

      options.push({
        label: `${month} ${year}`,
        value: `${year}-${monthIndex}`,
      });

      current = toZonedTime(
        new Date(current.setMonth(current.getMonth() + 1)),
        timeZone
      );
    }
    return options;
  };

  const monthOptions = generateMonthOptions();

  // Nilai default bulan saat ini dalam format YYYY-MM
  const currentMonth = format(toZonedTime(new Date(), timeZone), "yyyy-MM");

  // Fungsi untuk mendapatkan nilai awal dari searchParams
  const getInitialValue = () => {
    if (searchParams.startDate) {
      const date = toZonedTime(new Date(searchParams.startDate), timeZone);
      return format(date, "yyyy-MM");
    }
    return currentMonth;
  };

  const [selectedMonth, setSelectedMonth] = useState(getInitialValue());

  // Fungsi untuk memformat tanggal menjadi YYYY-MM-DD
  const formatDate = (date: Date): string => format(date, "yyyy-MM-dd");

  // Efek untuk memperbarui URL saat `selectedMonth` berubah
  useEffect(() => {
    const [year, month] = selectedMonth.split("-");
    const startDate = startOfMonth(
      toZonedTime(new Date(parseInt(year), parseInt(month) - 1, 1), timeZone)
    );
    const endDate = endOfMonth(startDate);

    const params = new URLSearchParams();
    params.set("startDate", formatDate(startDate));
    params.set("endDate", formatDate(endDate));

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedMonth]);

  // Fungsi untuk menangani perubahan bulan yang dipilih
  const handleMonthSelect = (value: string) => {
    setSelectedMonth(value);

    const [year, month] = value.split("-");
    const selectedDate = toZonedTime(
      new Date(parseInt(year), parseInt(month) - 1, 1),
      timeZone
    );
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);

    console.log("Tanggal Awal:", formatDate(startDate));
    console.log("Tanggal Akhir:", formatDate(endDate));
  };

  return (
    <Select value={selectedMonth} onValueChange={handleMonthSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
