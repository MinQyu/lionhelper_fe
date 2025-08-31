import { create } from 'zustand';
import { apiClient } from '@/api/apiClient';

// API 타입에서 courses 추출
export type Course = NonNullable<
  NonNullable<
    Awaited<ReturnType<typeof apiClient.trainingInfo.trainingInfoList>>['data']
  >['data']
>[number];

export type Courses = Course[];

interface BootcampStore {
  courses: Courses;
  isLoading: boolean;
  error: string | null;

  setCourses: (courses: Courses) => void;
  fetchCourses: () => Promise<void>;
  addCourse: (course: Course) => void;
  updateCourse: (id: number, updates: Partial<Course>) => void;
  deleteCourse: (id: number) => void;
  getCourseById: (id: number) => Course | undefined;
  getCourseByName: (name: string) => Course | undefined;
  getCoursesByManagerName: (managerName: string) => Courses | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBootcampStore = create<BootcampStore>((set, get) => ({
  // 초기 상태
  courses: [],
  isLoading: false,
  error: null,

  // 액션 구현
  setCourses: courses => set({ courses }),

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.trainingInfo.trainingInfoList({
        credentials: 'include',
      });

      if (response.data.success && response.data.data) {
        set({ courses: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data.message || '데이터를 불러올 수 없습니다.',
          isLoading: false,
        });
      }
    } catch (error: unknown) {
      console.error('fetchCourses 오류:', error);
      set({
        error: (error as { message: string }).message ?? '알 수 없는 오류',
        isLoading: false,
      });
    }
  },

  addCourse: course => set(state => ({ courses: [...state.courses, course] })),

  updateCourse: (id, updates) =>
    set(state => ({
      courses: state.courses.map(c => (c.id === id ? { ...c, ...updates } : c)),
    })),

  deleteCourse: id =>
    set(state => ({
      courses: state.courses.filter(c => c.id !== id),
    })),

  getCourseById: id => get().courses.find(c => c.id === id),

  getCourseByName: name => get().courses.find(c => c.training_course === name),

  getCoursesByManagerName: managerName =>
    get().courses.filter(c => c.manager_name === managerName),

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),
}));
