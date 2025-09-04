import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface TaskStatusCardProps {
  daily_task: boolean;
  unchecked_task: number;
  issue: number;
  check_rate: string;
  start_date: Date;
  end_date: Date;
  training_course: string;
}

interface PeriodicTask {
  id: number;
  description: string;
  url: string;
}

function TaskStatusCard({
  daily_task,
  unchecked_task,
  issue,
  check_rate,
  start_date,
  end_date,
  training_course,
}: TaskStatusCardProps) {
  const getPeriodicTask = (
    start_date: Date,
    end_date: Date
  ): PeriodicTask[] => {
    const periodic_task: PeriodicTask[] = [];
    const today = new Date();
    const start = new Date(start_date);
    const end = new Date(end_date);

    const getDiffDays = (start_date: Date, end_date: Date) => {
      const diffTime = Math.abs(end_date.getTime() - start_date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    // 금요일마다 주간 체크리스트
    if (today.getDay() === 5) {
      periodic_task.push({
        id: 1,
        description: '주간 체크리스트 작성일입니다',
        url: `/bootcamp/${encodeURIComponent(training_course)}/?tab=periodic-task&period=weekly`,
      });
    }

    // 개강 2주차 체크리스트
    if (getDiffDays(start, today) === 14) {
      periodic_task.push({
        id: 2,
        description: '개강 2주차 체크리스트 작성일입니다',
        url: `/bootcamp/${encodeURIComponent(training_course)}/?tab=periodic-task&period=2weeks`,
      });
    }

    // 수료후 1주일간 수료 체크리스트
    if (getDiffDays(end, today) >= 0 && getDiffDays(end, today) <= 7) {
      periodic_task.push({
        id: 3,
        description: '수료 체크리스트 작성 기간입니다',
        url: `/bootcamp/${encodeURIComponent(training_course)}/?tab=periodic-task&period=completion`,
      });
    }

    return periodic_task;
  };
  const periodicTasks = getPeriodicTask(start_date, end_date);

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">업무 현황</h4>
          <Link
            to={`/bootcamp/${training_course}`}
            className="hover:underline cursor-pointer text-sm xl:text-base"
          >
            관리 페이지 이동 {`->`}
          </Link>
        </div>
        <div className="space-y-2">
          <Card variant="outlined" className="flex justify-between px-3 py-2">
            <span className="text-sm flex items-center xl:text-base">
              오늘의 업무
            </span>
            <Badge
              variant={daily_task ? 'success' : 'destructive'}
              className="w-14 xl:w-18 px-0"
            >
              {daily_task ? '완료' : '미완료'}
            </Badge>
          </Card>
          <Card variant="outlined" className="flex justify-between px-3 py-2">
            <span className="text-sm flex items-center xl:text-base">
              미체크 항목
            </span>
            <Badge
              variant={unchecked_task > 0 ? 'destructive' : 'success'}
              className="w-14 xl:w-18"
            >
              {unchecked_task}개
            </Badge>
          </Card>
          <Card variant="outlined" className="flex justify-between px-3 py-2">
            <span className="text-sm flex items-center xl:text-base">
              이슈사항
            </span>
            <Badge
              variant={issue > 0 ? 'destructive' : 'success'}
              className="w-14 xl:w-18"
            >
              {issue}개
            </Badge>
          </Card>
          <Card variant="outlined" className="flex flex-col gap-2 px-3 py-2">
            <div className="flex justify-between">
              <span className="text-sm flex items-center xl:text-base">
                누적 체크율
              </span>
              <Badge variant="secondary" className="w-14 xl:w-18">
                {check_rate}
              </Badge>
            </div>
            <div className="bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${check_rate}` }}
              ></div>
            </div>
          </Card>
          {/* 기간별 업무 리마인더 */}
          {periodicTasks.length > 0 && (
            <div className="space-y-2">
              {periodicTasks.map(task => (
                <Card key={task.id} variant="outlined" className="px-3 py-2">
                  <div className="flex items-center justify-between text-primary">
                    <Link
                      to={task.url}
                      className="text-sm xl:text-base hover:underline cursor-pointer flex-1"
                    >
                      {task.description}
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default TaskStatusCard;
