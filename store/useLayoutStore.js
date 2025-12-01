import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_SIDEBAR_ITEM = "orders";
const DEFAULT_STATUS = "all";
const DEFAULT_PINNED_ACTIONS = ["create", "print", "export", "sync"];

// Initial state factory for resetting
const createInitialState = () => ({
  // Layout state
  activeSidebarItem: DEFAULT_SIDEBAR_ITEM,
  selectedStatus: DEFAULT_STATUS,
  pinnedActions: DEFAULT_PINNED_ACTIONS,

  // UI state
  sidebarCollapsed: false,
  pageSize: 25,

  // Filters and search
  searchQuery: "",
  selectedOrders: new Set(),
  sortField: "createdAt",
  sortDirection: "desc",
});

export const useLayoutStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        ...createInitialState(),

        // Sidebar actions
        setActiveSidebarItem: (id) =>
          set((state) => {
            state.activeSidebarItem = id;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        // Status filter actions
        setSelectedStatus: (id) =>
          set((state) => {
            state.selectedStatus = id;
          }),

        // Pinned actions
        togglePinnedAction: (id) =>
          set((state) => {
            const index = state.pinnedActions.indexOf(id);

            if (index > -1) {
              state.pinnedActions.splice(index, 1);
            } else {
              state.pinnedActions.push(id);
            }
          }),

        setPinnedActions: (actions) =>
          set((state) => {
            state.pinnedActions = actions;
          }),

        // Search and filters
        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query;
          }),

        // Order selection
        toggleOrderSelection: (orderId) =>
          set((state) => {
            const current = Array.from(state.selectedOrders);
            const newSet = new Set(current);

            if (newSet.has(orderId)) {
              newSet.delete(orderId);
            } else {
              newSet.add(orderId);
            }
            state.selectedOrders = newSet;
          }),

        setOrderSelection: (orderIds) =>
          set((state) => {
            state.selectedOrders = new Set(orderIds);
          }),

        selectAllOrders: (orderIds) =>
          set((state) => {
            state.selectedOrders = new Set(orderIds);
          }),

        clearOrderSelection: () =>
          set((state) => {
            state.selectedOrders = new Set();
          }),

        // Sorting
        setSorting: (field, direction) =>
          set((state) => {
            state.sortField = field;
            state.sortDirection = direction;
          }),

        toggleSortDirection: () =>
          set((state) => {
            state.sortDirection =
              state.sortDirection === "asc" ? "desc" : "asc";
          }),

        // Pagination
        setPageSize: (size) =>
          set((state) => {
            state.pageSize = size;
          }),

        // Reset to defaults
        resetFilters: () =>
          set((state) => {
            state.selectedStatus = DEFAULT_STATUS;
            state.searchQuery = "";
            state.selectedOrders = new Set();
            state.sortField = "createdAt";
            state.sortDirection = "desc";
          }),

        reset: () => set(createInitialState()),
      })),
      {
        name: "sse-layout-storage",
        partialize: (state) => ({
          activeSidebarItem: state.activeSidebarItem,
          pinnedActions: state.pinnedActions,
          sidebarCollapsed: state.sidebarCollapsed,
          pageSize: state.pageSize,
          sortField: state.sortField,
          sortDirection: state.sortDirection,
        }),
        // Convert Array back to Set on rehydration
        onRehydrateStorage: () => (state) => {
          // Ensure selectedOrders is a Set if it was somehow persisted or just initialize it
          if (state && Array.isArray(state.selectedOrders)) {
            state.selectedOrders = new Set(state.selectedOrders);
          } else if (state && !state.selectedOrders) {
            state.selectedOrders = new Set();
          }
        },
      },
    ),
    { name: "LayoutStore" },
  ),
);
