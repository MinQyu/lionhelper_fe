import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { useBootcampStore } from '@/store';
import { Link } from 'react-router-dom';
import { type Course } from '@/store/bootcampStore';
import { useMemo, useState } from 'react';

interface TaskStatusTabProps extends Course {
  daily_task: boolean;
  unchecked_task: number;
  issue_task: number;
  check_rate: number;
}

function TaskStatusTab() {
  const courses = useBootcampStore(state => state.courses);
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // 임시 파싱 코드
  const taskStatusTabData: TaskStatusTabProps[] = useMemo(() => {
    return courses.map(course => ({
      ...course,
      daily_task: Math.random() > 0.5,
      unchecked_task: Math.floor(Math.random() * 10),
      issue_task: Math.floor(Math.random() * 5),
      check_rate: Math.floor(Math.random() * 40) + 60,
    }));
  }, [courses]);

  const filteredData = useMemo(() => {
    if (selectedDept === 'all') {
      return taskStatusTabData;
    }
    return taskStatusTabData.filter(course => course.dept === selectedDept);
  }, [taskStatusTabData, selectedDept]);

  return (
    <div>
      <Card>
        <Select value={selectedDept} onValueChange={setSelectedDept}>
          <SelectTrigger className="w-30">
            <SelectValue placeholder="전체 보기" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 보기</SelectItem>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.dept}>
                {course.dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="border-2 border-border rounded-lg mt-2">
          <table className="w-full border-collapse overflow-hidden shadow-sm`">
            <thead className="bg-muted text-muted-foreground border-b-2 border-border">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  과정명
                </th>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  담당자
                </th>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  오늘의 업무
                </th>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  미체크
                </th>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  이슈
                </th>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  누적 체크율
                </th>
                <th className="px-4 py-2 whitespace-nowrap text-center">
                  출퇴근
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(course => (
                <tr
                  key={course.training_course}
                  className="border-t-1 border-border hover:bg-muted/10 transition-colors"
                >
                  <td className="px-4 py-2 text-center">
                    {course.training_course}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {course.manager_name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Badge
                      variant={course.daily_task ? 'success' : 'destructive'}
                      className="w-16 justify-center"
                    >
                      {course.daily_task ? '완료' : '미완료'}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {course.unchecked_task}
                  </td>
                  <td className="px-4 py-2 text-center">{course.issue_task}</td>
                  <td className="px-4 py-2 text-center">
                    {course.check_rate}%
                  </td>
                  <td className="px-4 py-2 text-center text-blue-600 cursor-pointer">
                    <Link
                      to={`/bootcamp/${course.training_course}?tab=attendance`}
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
