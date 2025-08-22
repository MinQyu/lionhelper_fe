import { create } from 'zustand';

export interface Course {
  id: string;
  course_name: string;
  // 향후 API 연동 시 추가될 수 있는 필드들
  description?: string;
  instructor?: string;
  start_date?: string;
  end_date?: string;
  status?: 'active' | 'inactive' | 'completed';
}

interface BootcampStore {
  // 상태
  courses: Course[];
  isLoading: boolean;
  error: string | null;

  // 액션
  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 목업 데이터 (API 연동 전까지 사용)
const mockCourses: Course[] = [
  { id: '1', course_name: '프론트엔드 14기' },
  { id: '2', course_name: '백엔드 14기' },
  { id: '3', course_name: '풀스택 14기' },
  { id: '4', course_name: 'AI/ML 14기' },
  { id: '5', course_name: '클라우드 엔지니어링 3기' },
];

export const useBootcampStore = create<BootcampStore>((set, get) => ({
  // 초기 상태
  courses: mockCourses, // 목업 데이터로 초기화
  isLoading: false,
  error: null,

  // 액션들
  setCourses: courses => set({ courses }),

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await api.getCourses();
      // set({ courses: response.data, isLoading: false });

      // 현재는 목업 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      set({ courses: mockCourses, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : '과정 목록을 불러오는데 실패했습니다.',
        isLoading: false,
      });
    }
  },

  addCourse: course =>
    set(state => ({
      courses: [...state.courses, course],
    })),

  updateCourse: (id, updates) =>
    set(state => ({
      courses: state.courses.map(course =>
        course.id === id ? { ...course, ...updates } : course
      ),
    })),

  deleteCourse: id =>
    set(state => ({
      courses: state.courses.filter(course => course.id !== id),
    })),

  getCourseById: id => {
    const state = get();
    return state.courses.find(course => course.id === id);
  },

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),
}));


