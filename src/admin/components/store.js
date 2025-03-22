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

// sort
export const useSortStore = create((set) => ({
  sortTerm: "",
  setSortTerm: (newSort) =>
    set((state) =>
      state.sortTerm !== newSort ? { sortTerm: newSort } : state
    ),
}));

//action
export const useActionStore = create((set) => ({
  selectedAction: "", // Trạng thái hành động được chọn
  setSelectedAction: (action) => set({ selectedAction: action }),
}));

// Store quản lý hành động xóa
export const useDeleteStore = create((set) => ({
  isDeleted: false, // Trạng thái true/false
  setDelete: (value) => set({ isDeleted: value }), // Cập nhật trạng thái
}));

// Tạo store cho danh mục
export const useCategoryStore = create((set) => ({
  selectedCategory: null, // Lưu trữ danh mục đã chọn (có thể là object hoặc chỉ _id)
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearSelectedCategory: () => set({ selectedCategory: null }),
}));