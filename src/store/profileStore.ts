import { create } from "zustand";
import type { Profile } from "@/types";

type ProfileState = {
  profile: Profile | null;
  completeness: number;
  setProfile: (p: Profile | null) => void;
  setCompleteness: (n: number) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  completeness: 0,
  setProfile: (profile) => set({ profile }),
  setCompleteness: (completeness) => set({ completeness }),
}));