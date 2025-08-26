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

interface TaskStatusTabProps {
  training_course: string;
  manager_name: string;
  daily_task: boolean;
  unchecked_task: number;
  issue_task: number;
  check_rate: number;
}

//목업용 데이터
const taskStatusTabData: TaskStatusTabProps[] = [
  {
    training_course: '과정명',
    manager_name: '담당자',
    daily_task: true,
    unchecked_task: 0,
    issue_task: 0,
    check_rate: 0,
  },
  {
    training_course: '과정명',
    manager_name: '담당자',
    daily_task: false,
    unchecked_task: 1,
    issue_task: 1,
    check_rate: 0,
  },
];

function TaskStatusTab() {
  const courses = useBootcampStore(state => state.courses);

  return (
    <div>
      <Card>
        <Select defaultValue="all">
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
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-muted/30 text-muted-foreground">
            <tr>
              <th className="px-4 py-2">과정명</th>
              <th className="px-4 py-2">담당자</th>
              <th className="px-4 py-2">오늘의 업무</th>
              <th className="px-4 py-2">미체크 항목</th>
              <th className="px-4 py-2">이슈사항</th>
              <th className="px-4 py-2">누적 체크율</th>
              <th className="px-4 py-2">출퇴근 현황</th>
            </tr>
          </thead>
          <tbody>
            {taskStatusTabData.map(course => (
              <tr
                key={course.training_course}
                className="border-t hover:bg-muted/10 transition-colors"
              >
                <td className="px-4 py-2">{course.training_course}</td>
                <td className="px-4 py-2">{course.manager_name}</td>
                <td className="px-4 py-2">
                  <Badge
                    variant={course.daily_task ? 'default' : 'outline'}
                    className="w-16 justify-center"
                  >
                    {course.daily_task ? '완료' : '미완료'}
                  </Badge>
                </td>
                <td className="px-4 py-2">{course.unchecked_task}</td>
                <td className="px-4 py-2">{course.issue_task}</td>
                <td className="px-4 py-2">{course.check_rate}</td>
                <td className="px-4 py-2 text-blue-600 cursor-pointer">
                  <Link to={'/'}>출퇴근 현황 조회</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default TaskStatusTab;
