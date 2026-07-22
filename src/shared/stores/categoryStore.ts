import { create } from 'zustand'

export interface Category {
  id: number
  name: string
  color: string
  createdAt: number
}

interface CategoryStore {
  categories: Category[]
  isLoading: boolean
  setCategories: (categories: Category[]) => void
  createCategory: (input: { name: string; color: string }) => Promise<void>
  updateCategory: (id: number, category: Partial<Category>) => void
  deleteCategory: (id: number) => Promise<void>
  getCategories: () => Category[]
  getCategoryById: (id: number) => Category | undefined
  loadCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,

  setCategories: (categories: Category[]) => set({ categories }),

  createCategory: async (input: { name: string; color: string }) => {
    if (!window.taskflow) return
    await window.taskflow.categories.create(input)
    await get().loadCategories()
  },

  updateCategory: (id: number, updates: Partial<Category>) =>
    set((state) => ({
      categories: state.categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
    })),

  deleteCategory: async (id: number) => {
    if (!window.taskflow) return
    await window.taskflow.categories.remove(id)
    await get().loadCategories()
  },

  getCategories: () => get().categories,

  getCategoryById: (id: number) => get().categories.find((cat) => cat.id === id),

  loadCategories: async () => {
    if (!window.taskflow) return
    set({ isLoading: true })
    try {
      const categories = (await window.taskflow.categories.getAll()) as Category[]
      set({ categories })
    } finally {
      set({ isLoading: false })
    }
  },
}))
