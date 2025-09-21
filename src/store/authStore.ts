import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

import type { User } from '@/types/user.types';
import { UserRole, UserStatus } from '@/types/user.types';

interface DecodedToken {
  exp: number;
  sub: string;
  role: UserRole;
}
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setSession: ({ accessToken, refreshToken }) => {
        try {
          const decodedToken = jwtDecode<DecodedToken>(accessToken);
          // Simulación de un objeto User a partir del token.
          // En una app real, podrías querer guardar más info del usuario al hacer login.
          const userPayload: User = {
            id: '', // El token JWT no suele llevar el ID de la BD
            email: decodedToken.sub,
            role: decodedToken.role,
            // Los siguientes campos no están en el token, se dejan vacíos o se obtienen de otra llamada
            first_name: 'Usuario',
            last_name: '',
            dni: '',
            worker_code: 0,
            status: UserStatus.ACTIVE,
          };

          set({
            accessToken,
            refreshToken,
            user: userPayload,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to decode token or set session:', error);
          get().logout();
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      hydrate: () => {
        const { accessToken } = get();

        if (accessToken) {
          try {
            const decoded = jwtDecode<DecodedToken>(accessToken);
            const isTokenExpired = decoded.exp * 1000 < Date.now();

            if (isTokenExpired) {
              get().logout();
            } else {
              // Si el token es válido, rehidratamos la sesión.
              get().setSession({ accessToken: get().accessToken!, refreshToken: get().refreshToken! });
            }
          } catch (error) {
            console.error('Hydration failed:', error);
            get().logout();
          }
        }
      },
    }),
    {
      name: 'fsr-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Llama a hydrate al cargar la aplicación para verificar el estado de la sesión
useAuthStore.getState().hydrate();