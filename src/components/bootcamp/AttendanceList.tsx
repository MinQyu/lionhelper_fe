import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useParams } from 'react-router-dom';
import { useBootcampStore } from '@/store/bootcampStore';
import { apiClient } from '@/api/apiClient';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// API 타입에서 attendance 추출
export type AttendanceRecord = NonNullable<
  NonNullable<
    NonNullable<
      Awaited<ReturnType<typeof apiClient.attendance.attendanceList>>['data']
    >['data']
  >['items']
>[number];

function AttendanceList() {
  const { CourseName } = useParams<{ CourseName: string }>();
  const { getCourseByName, courses, fetchCourses } = useBootcampStore();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>('');

  const decodedCourseName = CourseName ? decodeURIComponent(CourseName) : '';
  const currentCourse = decodedCourseName
    ? getCourseByName(decodedCourseName)
    : null;

  // 과정 기간에 따른 월 옵션 생성
  const monthOptions = useMemo(() => {
    if (!currentCourse?.start_date) return [];

    const startDate = new Date(currentCourse.start_date);
    const currentDate = new Date();
    const options: { year: number; month: number; label: string }[] = [];

    // 시작일부터 현재까지의 모든 월을 생성
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1; // getMonth()는 0부터 시작
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (let year = startYear; year <= currentYear; year++) {
      const monthStart = year === startYear ? startMonth : 1;
      const monthEnd = year === currentYear ? currentMonth : 12;

      for (let month = monthStart; month <= monthEnd; month++) {
        options.push({
          year,
          month,
          label: `${year}년 ${month}월`,
        });
      }
    }

    return options;
  }, [currentCourse?.start_date]);

  // 출퇴근 기록 조회
  const fetchAttendanceData = useCallback(async () => {
    if (!currentCourse?.training_course || !selectedYearMonth) return;

    const [year, month] = selectedYearMonth.split('-').map(Number);

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.attendance.attendanceList({
        year,
        month,
        training_course: currentCourse.training_course,
        per_page: 100, // 한 달치 데이터를 모두 가져오기 위해 큰 값 설정
      });

      if (response.data.success && response.data.data?.items) {
        setAttendanceData(response.data.data.items);
      } else {
        setError(response.data.message || '출퇴근 기록을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('출퇴근 기록 조회 오류:', error);
      setError('출퇴근 기록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCourse?.training_course, selectedYearMonth]);

  // 과정 정보 로드
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

  // 출퇴근 기록 조회
  useEffect(() => {
    if (currentCourse?.training_course && selectedYearMonth) {
      fetchAttendanceData();
    }
  }, [currentCourse?.training_course, selectedYearMonth, fetchAttendanceData]);

  // 과정이 로드되면 가장 최근 월을 기본값으로 설정
  useEffect(() => {
    if (monthOptions.length > 0 && !selectedYearMonth) {
      const latestOption = monthOptions[monthOptions.length - 1];
      setSelectedYearMonth(`${latestOption.year}-${latestOption.month}`);
    }
  }, [monthOptions, selectedYearMonth]);

  // 월 변경 핸들러
  const handleMonthChange = (yearMonth: string) => {
    setSelectedYearMonth(yearMonth);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  };

  // 시간 포맷팅
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '-';
    return timeString;
  };

  // 직급 포맷팅
  const formatInstructorRole = (instructor: string | undefined) => {
    if (!instructor) return '-';
    switch (instructor) {
      case '1':
        return '주강사';
      case '2':
        return '보조강사';
      default:
        return instructor;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <LoadingSpinner
          className="h-32"
          message="출퇴근 기록을 불러오는 중..."
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <p>오류: {error}</p>
          <button
            onClick={fetchAttendanceData}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">출퇴근 기록 조회</h3>
          <div className="flex gap-2">
            <Select value={selectedYearMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="월 선택" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(option => (
                  <SelectItem
                    key={`${option.year}-${option.month}`}
                    value={`${option.year}-${option.month}`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {attendanceData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {selectedYearMonth
              ? monthOptions.find(
                  opt => `${opt.year}-${opt.month}` === selectedYearMonth
                )?.label + '의 출퇴근 기록이 없습니다.'
              : '월을 선택해주세요.'}
          </div>
        ) : (
          <div className="border-2 border-border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                    날짜
                  </th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                    강사명
                  </th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                    직급
                  </th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                    출근시간
                  </th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                    퇴근시간
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map(record => (
                  <tr
                    key={record.id}
                    className="border-t border-border hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="font-medium">
                        {formatDate(record.date || '')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {record.instructor_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {formatInstructorRole(record.instructor)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-medium">
                          {formatTime(record.check_in)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-medium">
                          {formatTime(record.check_out)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

export default AttendanceList;
