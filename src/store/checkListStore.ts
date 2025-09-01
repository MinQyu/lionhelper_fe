import { create } from 'zustand';
import { apiClient } from '@/api/apiClient';

// API 타입에서 tasks 추출
export type Task = NonNullable<
  NonNullable<
    Awaited<ReturnType<typeof apiClient.tasks.tasksList>>['data']
  >['data']
>[number];

export type Tasks = Task[];

export interface TaskCreateData {
  training_course: string;
  username: string;
  updates: {
    task_name: string;
    is_checked: boolean;
  }[];
}

interface CheckListStore {
  tasks: Tasks;
  isLoading: boolean;
  error: string | null;
  selectedPeriod: string | null;
  selectedValues: Record<string, string>;
  reasons: Record<string, string>;

  setTasks: (tasks: Tasks) => void;
  fetchTasks: (taskCategory?: string) => Promise<void>;
  createTask: (taskData: TaskCreateData) => Promise<boolean>;
  getTasksByPeriod: (period: string) => Tasks;
  setSelectedPeriod: (period: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // 체크리스트 상태 관리
  setSelectedValue: (itemId: number, value: string) => void;
  setReason: (itemId: number, reason: string) => void;
  clearSelectedValues: () => void;
  clearReasons: () => void;
  resetForm: () => void;

  // periodic 체크리스트를 위한 별도 상태
  periodicSelectedValues: Record<string, string>;
  periodicReasons: Record<string, string>;
  currentPeriodicPeriod: string | null;
  setPeriodicSelectedValue: (itemId: number, value: string) => void;
  setPeriodicReason: (itemId: number, reason: string) => void;
  setCurrentPeriodicPeriod: (period: string | null) => void;
  clearPeriodicSelectedValues: () => void;
  clearPeriodicReasons: () => void;
  resetPeriodicForm: () => void;
}

export const useCheckListStore = create<CheckListStore>((set, get) => ({
  // 초기 상태
  tasks: [],
  isLoading: false,
  error: null,
  selectedPeriod: null,
  selectedValues: {},
  reasons: {},

  // periodic 체크리스트를 위한 별도 상태
  periodicSelectedValues: {},
  periodicReasons: {},
  currentPeriodicPeriod: null,

  // 액션 구현
  setTasks: tasks => set({ tasks }),

  fetchTasks: async (taskCategory?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.tasks.tasksList(
        taskCategory ? { task_category: taskCategory } : undefined,
        { credentials: 'include' }
      );

      if (response.data.success && response.data.data) {
        set({ tasks: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data.message || '체크리스트를 불러올 수 없습니다.',
          isLoading: false,
        });
      }
    } catch (error: unknown) {
      console.error('fetchTasks 오류:', error);
      set({
        error: (error as { message: string }).message ?? '알 수 없는 오류',
        isLoading: false,
      });
    }
  },

  createTask: async (taskData: TaskCreateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.tasks.tasksCreate(taskData, {
        credentials: 'include',
      });

      if (response.data.success) {
        // 성공적으로 생성된 후 tasks를 다시 불러옴
        await get().fetchTasks();
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: response.data.message || '체크리스트 생성에 실패했습니다.',
          isLoading: false,
        });
        return false;
      }
    } catch (error: unknown) {
      console.error('createTask 오류:', error);
      set({
        error: (error as { message: string }).message ?? '알 수 없는 오류',
        isLoading: false,
      });
      return false;
    }
  },

  getTasksByPeriod: (period: string) => {
    const { tasks } = get();
    return tasks.filter(task => task.task_period === period);
  },

  setSelectedPeriod: (period: string | null) => set({ selectedPeriod: period }),

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  clearError: () => set({ error: null }),

  // 체크리스트 상태 관리
  setSelectedValue: (itemId: number, value: string) =>
    set(state => ({
      selectedValues: { ...state.selectedValues, [itemId]: value },
    })),
  setReason: (itemId: number, reason: string) =>
    set(state => ({ reasons: { ...state.reasons, [itemId]: reason } })),
  clearSelectedValues: () => set({ selectedValues: {} }),
  clearReasons: () => set({ reasons: {} }),
  resetForm: () => {
    get().clearSelectedValues();
    get().clearReasons();
  },

  // periodic 체크리스트 상태 관리
  setPeriodicSelectedValue: (itemId: number, value: string) =>
    set(state => ({
      periodicSelectedValues: {
        ...state.periodicSelectedValues,
        [itemId]: value,
      },
    })),
  setPeriodicReason: (itemId: number, reason: string) =>
    set(state => ({
      periodicReasons: { ...state.periodicReasons, [itemId]: reason },
    })),
  setCurrentPeriodicPeriod: (period: string | null) => {
    set({ currentPeriodicPeriod: period });
    // period가 변경되면 폼 초기화
    get().resetPeriodicForm();
  },
  clearPeriodicSelectedValues: () => set({ periodicSelectedValues: {} }),
  clearPeriodicReasons: () => set({ periodicReasons: {} }),
  resetPeriodicForm: () => {
    get().clearPeriodicSelectedValues();
    get().clearPeriodicReasons();
  },
}));
