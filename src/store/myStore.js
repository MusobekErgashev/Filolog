import { create } from "zustand";

const myStore = create((set) => ({
    isSavedBooksComponent: false,

    changeComponentOnLibrary: () => set((state) => ({ isSavedBooksComponent: !state.isSavedBooksComponent })),
}))

export default myStore