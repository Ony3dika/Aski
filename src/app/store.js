import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      //Full Menu
      menu: false,

      updateMenu: (newMenu) =>
        set((state) => ({
          menu: newMenu,
        })),

      mobile: false,

      updateMobile: (newMobile) =>
        set((state) => ({
          mobile: newMobile,
        })),
    }),

    {
      name: "aski",
    }
  )
);