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

      //Mobile Menu
      mobile: false,

      updateMobile: (newMobile) =>
        set((state) => ({
          mobile: newMobile,
        })),

      //User
      user: null,
      updateUser: (newUser) =>
        set((state) => ({
          user: newUser,
        })),
    }),

    {
      name: "aski",
    }
  )
);
