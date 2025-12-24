import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Locale = 'en' | 'zh';
export type LocaleChoice = 'auto' | Locale;

export type LocaleState = {
  choice: LocaleChoice;
  setChoice: (value: LocaleChoice) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      choice: 'auto',
      setChoice: (value) => set({ choice: value }),
    }),
    {
      name: 'locale-choice',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

