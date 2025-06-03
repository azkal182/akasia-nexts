import React from 'react';
import FuelView from "@/features/fuel/fuel-view";
import PageContainer from "@/components/layout/page-container";
import CashflowPage from "@/app/dashboard/fuel/CashflowPage";
import {getCars} from "@/actions/car";

async function FuelPage() {
    const cars = await getCars()
    return (
        <PageContainer><CashflowPage cars={cars}/></PageContainer>
    );
}

export default FuelPage;