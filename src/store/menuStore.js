import { create } from 'zustand'

const useMenuStore = create((set) => ({
    isOpen: false,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
    closeMenu: () => set({ isOpen: false }),
    openMenu: () => set({ isOpen: true }),
}))

export default useMenuStore
