import { create } from "zustand";
import { createAuthSlice } from "./slicer/auth.slice";
import { createChatSlice } from "./slicer/chat.slice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))