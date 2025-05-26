import React from "react";
import FormulirPerizinanMobil from "./FormulirPerizinanMobil";
import { getCars } from "@/actions/pengajuan-dana";
import PageContainer from "@/components/layout/page-container";

const page = async () => {
  const cars = await getCars();

  return (
    <PageContainer>
      <FormulirPerizinanMobil />
    </PageContainer>
  );
};

export default page;
