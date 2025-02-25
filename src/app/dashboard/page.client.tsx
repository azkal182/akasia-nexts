"use client";

import MonthYearSelect from "@/components/month-year-select";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardClient({
  initialSearchParams,
}: {
  initialSearchParams: Record<string, string | undefined>;
}) {
  const searchParams = useSearchParams();

  const currentDate = new Date();
  const defaultStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const defaultEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const startDateRaw =
    searchParams.get("startDate") || initialSearchParams.startDate;
  const endDateRaw = searchParams.get("endDate") || initialSearchParams.endDate;

  const [startDate, setStartDate] = useState(
    new Date(startDateRaw || defaultStartDate)
  );
  const [endDate, setEndDate] = useState(
    new Date(endDateRaw || defaultEndDate)
  );

  useEffect(() => {
    const newStartDate = startDateRaw
      ? new Date(startDateRaw)
      : defaultStartDate;
    const newEndDate = endDateRaw ? new Date(endDateRaw) : defaultEndDate;

    if (!isNaN(newStartDate.getTime()) && !isNaN(newEndDate.getTime())) {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  }, [startDateRaw, endDateRaw]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Start Date: {startDate.toDateString()}</p>
      <p>End Date: {endDate.toDateString()}</p>
      <MonthYearSelect
        searchParams={{
          startDate: new Date(startDate).toDateString(),
          endDate: new Date(endDate).toDateString(),
        }}
      />
    </div>
  );
}
