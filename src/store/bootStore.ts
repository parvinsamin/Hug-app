// src/store/bootStore.ts
import { create } from 'zustand';

export type BootStatus = 'idle' | 'loading' | 'ready' | 'error';

interface BootState {
    status: BootStatus;
    language: string | null;
    country: string | null;
    error: string | null;
    setStatus: (status: BootStatus) => void;
    setLanguage: (lang: string | null) => void;
    setCountry: (country: string | null) => void;
    setError: (message: string | null) => void;
}

export const useBootStore = create<BootState>((set) => ({
    status: 'idle',
    language: null,
    country: null,
    error: null,
    setStatus: (status) => set({ status }),
    setLanguage: (language) => set({ language }),
    setCountry: (country) => set({ country }),
    setError: (error) => set({ error }),
}));
