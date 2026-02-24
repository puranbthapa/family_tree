import { create } from 'zustand';

const useTreeStore = create((set) => ({
  currentTree: null,
  persons: [],
  relationships: [],
  selectedPerson: null,

  setCurrentTree: (tree) => set({ currentTree: tree }),
  setPersons: (persons) => set({ persons }),
  setRelationships: (relationships) => set({ relationships }),
  setSelectedPerson: (person) => set({ selectedPerson: person }),

  addPerson: (person) => set((state) => ({ persons: [...state.persons, person] })),
  updatePerson: (id, data) =>
    set((state) => ({
      persons: state.persons.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removePerson: (id) =>
    set((state) => ({
      persons: state.persons.filter((p) => p.id !== id),
      selectedPerson: state.selectedPerson?.id === id ? null : state.selectedPerson,
    })),

  addRelationship: (rel) =>
    set((state) => ({ relationships: [...state.relationships, rel] })),
  removeRelationship: (id) =>
    set((state) => ({
      relationships: state.relationships.filter((r) => r.id !== id),
    })),
}));

export default useTreeStore;
