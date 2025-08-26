import { create } from 'zustand';

export interface Course {
  id: string;
  training_course: string;
  dept: string;
  start_date: string;
  end_date: string;
  manager_name: string;
  created_at: string;
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
  getCourseByName: (name: string) => Course | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 목업 데이터 (API 연동 전까지 사용)
const mockCourses: Course[] = [
  {
    id: '1',
    training_course: '데이터 분석 스쿨 100기',
    dept: 'TechSol',
    start_date: '2025-01-02',
    end_date: '2025-06-01',
    manager_name: '홍길동',
    created_at: '2025-01-15T10:30:00',
  },
  {
    id: '2',
    training_course: '웹 개발 스쿨 50기',
    dept: 'DevTeam',
    start_date: '2025-02-01',
    end_date: '2025-07-01',
    manager_name: '김철수',
    created_at: '2025-01-20T14:15:00',
  },
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

  getCourseByName: name => {
    const state = get();
    return state.courses.find(course => course.training_course === name);
  },

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),
}));
