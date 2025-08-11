import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
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
