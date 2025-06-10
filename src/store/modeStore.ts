// // store/modeStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// type Mode = 'admin' | 'driver' | null;

// interface ModeState {
//   mode: Mode;
//   setMode: (mode: Mode) => void;
// }

// export const useModeStore = create<ModeState>()(
//   persist(
//     (set) => ({
//       mode: null,
//       setMode: (mode) => set({ mode })
//     }),
//     {
//       name: 'app-mode'
//     }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Mode = 'admin' | 'driver' | null;

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  resetMode: () => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: null,
      setMode: (mode) => set({ mode }),
      resetMode: () => set({ mode: null }) // Tambahkan reset
    }),
    {
      name: 'app-mode'
    }
  )
);
