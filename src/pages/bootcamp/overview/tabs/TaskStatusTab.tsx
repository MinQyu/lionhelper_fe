import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';
import { useMemo, useState, useEffect } from 'react';

export type OverAllTaskStatus = NonNullable<
  NonNullable<
    Awaited<ReturnType<typeof apiClient.admin.taskStatusCombinedList>>['data']
  >['data']
>[number];

interface TaskStatusTabProps extends OverAllTaskStatus {
  unchecked_task: number;
  issue_task: number;
}

function TaskStatusTab() {
  const [taskStatusData, setTaskStatusData] = useState<TaskStatusTabProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');

  useEffect(() => {
    const fetchTaskStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.admin.taskStatusCombinedList();

        if (response.data.success && response.data.data) {
          // API 응답을 TaskStatusTabProps로 파싱
          const parsedData: TaskStatusTabProps[] = response.data.data.map(
            item => ({
              ...item,
              unchecked_task: Math.floor(Math.random() * 10), // 임시 데이터, 나중에 실제 API로 교체
              issue_task: Math.floor(Math.random() * 5), // 임시 데이터, 나중에 실제 API로 교체
            })
          );

          setTaskStatusData(parsedData);
        } else {
          setError(
            response.data.message || '태스크 상태를 불러올 수 없습니다.'
          );
        }
      } catch (error) {
        console.error('태스크 상태 조회 오류:', error);
        setError('태스크 상태를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskStatus();
  }, []);

  const uniqueDepts = useMemo(() => {
    const depts = taskStatusData
      .map(item => item.dept)
      .filter((dept): dept is string => Boolean(dept));
    return Array.from(new Set(depts));
  }, [taskStatusData]);

  const filteredData = useMemo(() => {
    if (selectedDept === 'all') {
      return taskStatusData;
    }
    return taskStatusData.filter(item => item.dept === selectedDept);
  }, [taskStatusData, selectedDept]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">태스크 상태를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-destructive">
            오류가 발생했습니다
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (taskStatusData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">태스크 상태가 없습니다</h3>
          <p className="text-muted-foreground">
            등록된 태스크 상태가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">전체 업무 현황</h3>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="부서 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 보기</SelectItem>
              {uniqueDepts.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-2 border-border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  과정명
                </th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  담당자
                </th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  오늘의 업무
                </th>
                {/* <th className="px-4 py-3 text-center font-medium">미체크</th> */}
                {/* <th className="px-4 py-3 text-center font-medium">이슈</th> */}
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  전일 체크율
                </th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  월별 누적 체크율
                </th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  출퇴근 조회
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr
                  key={item.training_course}
                  className="border-t border-border hover:bg-muted/10 transition-colors"
                >
                  <td className="px-4 py-3 text-center">
                    <div className="font-medium">{item.training_course}</div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.manager_name}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={
                        item.daily_check_rate === '100%'
                          ? 'success'
                          : 'destructive'
                      }
                      className="w-16 xl:w-18 justify-center"
                    >
                      {item.daily_check_rate === '100%' ? '완료' : '미완료'}
                    </Badge>
                  </td>
                  {/* <td className="px-4 py-3 text-center">
                    <Badge
                      variant={
                        item.unchecked_task > 0 ? 'destructive' : 'success'
                      }
                      className="w-12 justify-center"
                    >
                      {item.unchecked_task}
                    </Badge>
                  </td> */}
                  {/* <td className="px-4 py-3 text-center">
                    <Badge
                      variant={item.issue_task > 0 ? 'destructive' : 'success'}
                      className="w-12 justify-center"
                    >
                      {item.issue_task}
                    </Badge>
                  </td> */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <span className="font-medium">
                        {item.yesterday_check_rate}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <span className="font-medium">
                        {item.overall_check_rate}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/bootcamp/${encodeURIComponent(item.training_course || '')}?tab=attendance`}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      조회
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default TaskStatusTab;
