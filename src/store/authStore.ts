import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/api/apiClient';

type LoginCreateResponse = NonNullable<
  NonNullable<Awaited<ReturnType<typeof apiClient.me.getMe>>['data']>['data']
>;
type User = LoginCreateResponse['user'];

interface AuthState {
  isLoggedIn: boolean | null;
  user: User | null;
  loading: boolean;
  initialized: boolean; // 인증 상태 확인이 완료되었는지 여부

  checkAuthStatus: () => Promise<void>;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean }>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: null,
      user: null,
      loading: false,
      initialized: false,

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      checkAuthStatus: async () => {
        const { initialized, loading, user: savedUser } = get();
        if (initialized || loading) return;

        try {
          set({ loading: true });

          if (savedUser) {
            set({
              isLoggedIn: true,
              user: savedUser,
              loading: true,
              initialized: false,
            });
          }

          const response = await apiClient.me.getMe();

          if (response.data.success && response.data.data?.user) {
            set({
              isLoggedIn: true,
              user: response.data.data.user,
              loading: false,
              initialized: true,
            });
          } else {
            set({
              isLoggedIn: false,
              user: null,
              loading: false,
              initialized: true,
            });
          }
        } catch (error) {
          console.error('인증 상태 확인 오류:', error);
          set({
            isLoggedIn: false,
            user: null,
            loading: false,
            initialized: true,
          });
        }
      },

      login: async (username: string, password: string) => {
        const response = await apiClient.login.loginCreate({
          username,
          password,
        });

        if (response.data.success) {
          const responseData = response.data as LoginCreateResponse;
          const userData = responseData.user as User;
          set({
            isLoggedIn: true,
            user: userData as User,
            loading: false,
            initialized: true,
          });
          return { success: true };
        } else {
          return {
            success: false,
            error: response.data.message || '로그인에 실패했습니다.',
          };
        }
      },

      logout: async () => {
        try {
          await apiClient.logout.logoutCreate();
        } catch (error) {
          console.error('로그아웃 API 오류:', error);
        }

        set({
          isLoggedIn: false,
          user: null,
          loading: false,
          initialized: true,
        });
        return { success: true };
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => state => {
        if (state && state.isLoggedIn && !state.user) {
          console.log('사용자 정보가 누락되어 서버에서 다시 가져옵니다.');
          setTimeout(() => {
            state.checkAuthStatus();
          }, 100);
        }
      },
    }
  )
);
