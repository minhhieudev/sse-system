"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clearAuthTokenCookie, getAuthTokenFromCookie, setAuthTokenCookie } from "@/lib/authCookies";
import { ROLE_PERMISSIONS } from "@/lib/auth";

const buildDefaultState = () => {
  const token = getAuthTokenFromCookie();
  return {
    user: null,
    token,
    isAuthenticated: Boolean(token),
    hasHydrated: true,
  };
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...buildDefaultState(),
      hasHydrated: false,

      login: (userData, token) =>
        set(() => {
          const tokenToUse = token ?? getAuthTokenFromCookie();
          if (tokenToUse) {
            setAuthTokenCookie(tokenToUse);
          }

          // Enrich user with permissions if role exists
          let userWithPermissions = userData;
          if (userData && userData.role) {
            const permissions = ROLE_PERMISSIONS[userData.role] || {};
            userWithPermissions = { ...userData, permissions };
          }

          return {
            user: userWithPermissions,
            token: tokenToUse ?? null,
            isAuthenticated: Boolean(tokenToUse),
          };
        }),

      logout: () =>
        set(() => {
          clearAuthTokenCookie();
          return {
            ...buildDefaultState(),
            hasHydrated: true,
          };
        }),

      updateUser: (payload) =>
        set((state) => {
          let updatedUser = state.user ? { ...state.user, ...payload } : payload;
          if (updatedUser && updatedUser.role) {
            const permissions = ROLE_PERMISSIONS[updatedUser.role] || {};
            updatedUser = { ...updatedUser, permissions };
          }
          return {
            user: updatedUser,
            isAuthenticated: Boolean(updatedUser ?? state.token),
          };
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Helper methods for permissions
      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions?.[permission] || false;
      },

      canPerformAction: (action) => {
        const { user } = get();
        return user?.permissions?.allowedActions?.includes(action) || false;
      }
    }),
    {
      name: "sse-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token ?? getAuthTokenFromCookie();
        if (token) {
          setAuthTokenCookie(token);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);

export const authSelectors = {
  user: (state) => state.user,
  isAuthenticated: (state) => state.isAuthenticated,
};
