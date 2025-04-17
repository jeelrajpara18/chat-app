import { create } from "zustand";
import { createAuthSlice } from "./slicer/auth.slice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a)
}))