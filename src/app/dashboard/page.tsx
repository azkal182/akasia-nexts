'use client';

import { useEffect, useState } from 'react';
import { useModeStore } from '@/store/modeStore';
import { toast } from 'sonner';
import DriverModePage from '@/features/dashboard/driver-mode/driver-mode-page';
import AdminModePage from '@/features/dashboard/admin-mode/admin-mode-page';

export type Car = {
  id: string;
  name: string;
  licensePlate: string | null;
  status: 'IN_USE' | 'AVAILABLE'; // tambahkan status lain jika ada
  createdAt: string; // bisa juga Date jika langsung dikonversi
  updatedAt: string;
};

export type UsageRecord = {
  id: string;
  carId: string;
  userId: string;
  purpose: string;
  destination: string;
  startTime: Date;
  endTime: Date | null;
  status: 'ONGOING' | 'COMPLETE'; // tambahkan status lain jika ada
  createdAt: string;
  updatedAt: string;
  car: Car;
};

export default function Home() {
  const mode = useModeStore((state) => state.mode);

  const [currentStatus, setCurrentStatus] = useState<UsageRecord | null>();

  const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/current_status');
      if (!response.ok) {
        throw new Error('Gagal mendapatkan data pengguna');
      }
      const user = await response.json();
      setCurrentStatus(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const onComplete = async (data: { id: string; userId: string }) => {
    try {
      const response = await fetch(`/api/usage-records/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endTime: new Date().toISOString(),
          userId: data.userId
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menyelesaikan perjalanan');
      }

      toast.success('Perjalanan selesai');
      setCurrentStatus(null);
      //   window.location.reload(); // Reload halaman untuk memperbarui data
    } catch (error) {
      console.error('Error completing trip:', error);
      toast.error('Gagal menyelesaikan perjalanan');
    }
  };

  if (!mode) return null;
  if (mode === 'driver') {
    return (
      <DriverModePage
        currentStatus={currentStatus}
        onComplete={(data) => onComplete(data)}
        onGo={() => getCurrentUser()}
      />
    );
  } else {
    return <AdminModePage />;
  }
}
