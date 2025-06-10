// 'use client';

// import { useSession } from 'next-auth/react';
// import { useEffect } from 'react';
// import { useModeStore } from '@/store/modeStore';

// export function AuthInitializer() {
//   const { data: session, status } = useSession();
//   const setMode = useModeStore((state) => state.setMode);

//   useEffect(() => {
//     if (status === 'authenticated') {
//       const role = session?.user?.role;
//       console.log('Session authenticated:', session);
//       console.log('User role:', role);
//       if (role === 'DRIVER') {
//         console.log('User is a driver');
//         setMode('driver');
//       } else {
//         console.log('User is an admin');
//         setMode('admin');
//       }
//     }
//   }, [status, session, setMode]);

//   return null;
// }

'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useModeStore } from '@/store/modeStore';

export function AuthInitializer() {
  const { data: session, status } = useSession();
  const { mode, setMode } = useModeStore();

  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role?.toLowerCase();

      // Jika driver, paksa mode driver
      if (role === 'driver' && mode !== 'driver') {
        console.log('User is a driver');
        setMode('driver');
        return;
      }

      // Jika admin, hanya set saat mode masih kosong (misalnya saat awal)
      if (role !== 'driver' && mode !== 'admin' && mode !== 'driver') {
        console.log('User is an admin (initial set)');
        setMode('admin');
      }
    }
  }, [status, session, setMode, mode]);

  return null;
}
