import { create } from "zustand";

// Tìm kiếm
export const useSearchStore = create((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  resetSearchTerm: () => set({ searchTerm: "" }),
}));

// lọc trạng thái
export const useStatusStore = create((set) => ({
  statusTerm: "", // Trạng thái được chọn
  setStatusTerm: (status) => set({ statusTerm: status }), // Setter để cập nhật trạng thái
}));

// reset
export const useResetStore = create((set) => ({
  isActive: true,
  toggleActive: () => set((state) => ({ isActive: !state.isActive })),
}));


