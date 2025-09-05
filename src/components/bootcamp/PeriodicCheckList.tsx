import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CheckListItem from './CheckListItem';
import { useCheckListStore } from '@/store/checkListStore';
import { apiClient } from '@/api/apiClient';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';

interface TaskCheckList {
  task_id: number;
  training_course: string;
  is_checked: boolean;
  checked_date: Date;
  username: string;
}

interface UncheckedTask {
  task_id: number;
  reason: string;
}

const PERIOD_OPTIONS = [
  { value: 'weekly', label: '주간' },
  { value: '2weeks', label: '개강2주' },
  { value: 'recruit', label: '모집기간' },
  { value: 'completion', label: '수료기간' },
];

function PeriodicCheckList() {
  const { CourseName } = useParams<{ CourseName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    periodicSelectedValues,
    periodicReasons,
    currentPeriodicPeriod,
    setPeriodicSelectedValue,
    setPeriodicReason,
    setCurrentPeriodicPeriod,
    resetPeriodicForm,
  } = useCheckListStore();
  const {
    user: { username },
  } = useAuthStore() as { user: { username: string } };

  // URL 파라미터에서 training_course 가져오기
  const trainingCourse = CourseName as string;

  // URL 파라미터에서 기간 가져오기
  const periodFromUrl = searchParams.get('period');

  // 선택된 period에 따른 체크리스트만 필터링하고 id가 있는 항목만 포함
  const periodicTasks = currentPeriodicPeriod
    ? tasks.filter(
        task => task.task_period === currentPeriodicPeriod && task.id
      )
    : [];

  // 컴포넌트 마운트 시 체크리스트 데이터 로드
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // URL 파라미터와 상태 동기화
  useEffect(() => {
    if (periodFromUrl && periodFromUrl !== currentPeriodicPeriod) {
      setCurrentPeriodicPeriod(periodFromUrl);
    }
  }, [periodFromUrl, currentPeriodicPeriod, setCurrentPeriodicPeriod]);

  const groupedData = periodicTasks.reduce(
    (acc, item) => {
      if (!acc[item.task_category || '기타']) {
        acc[item.task_category || '기타'] = [];
      }
      acc[item.task_category || '기타'].push(item);
      return acc;
    },
    {} as Record<string, typeof periodicTasks>
  );

  const handleValueChange = (itemId: number, value: string) => {
    setPeriodicSelectedValue(itemId, value);
    if (value === 'true') {
      // 체크된 경우 사유 제거
      setPeriodicReason(itemId, '');
    }
  };

  const handleInputChange = (itemId: number, reason: string) => {
    setPeriodicReason(itemId, reason);
  };

  const handlePeriodChange = (period: string) => {
    setCurrentPeriodicPeriod(period);
    // URL 파라미터 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('period', period);
    setSearchParams(newSearchParams);
  };

  // 체크리스트 데이터를 TaskCheckList 형태로 변환
  const prepareTaskCheckList = () => {
    const checkList: TaskCheckList[] = [];
    const unchecked: UncheckedTask[] = [];

    periodicTasks.forEach(item => {
      if (item.id) {
        const isChecked = periodicSelectedValues[item.id.toString()] === 'true';
        const checkedDate = new Date();

        checkList.push({
          task_id: item.id,
          training_course: trainingCourse,
          is_checked: isChecked,
          checked_date: checkedDate,
          username: username,
        });

        // 미체크 항목인 경우 사유와 함께 별도 객체로 관리
        if (!isChecked) {
          unchecked.push({
            task_id: item.id,
            reason: periodicReasons[item.id.toString()] || '',
          });
        }
      }
    });

    return { checkList, unchecked };
  };

  const handleSubmit = async () => {
    if (!currentPeriodicPeriod) {
      alert('기간을 선택해주세요.');
      return;
    }

    // 모든 항목이 체크되었는지 확인
    const totalItems = periodicTasks.length;
    const checkedItems = Object.keys(periodicSelectedValues).length;

    if (checkedItems < totalItems) {
      alert('모든 체크리스트 항목을 작성해주세요.');
      return;
    }

    const { checkList, unchecked } = prepareTaskCheckList();
    console.log('체크리스트 데이터:', checkList);
    console.log('미체크 항목:', unchecked);

    try {
      // 체크된 항목들을 createTask로 전송
      const updates = periodicTasks.map(item => ({
        task_name: item.task_name || '',
        is_checked:
          periodicSelectedValues[item.id?.toString() || ''] === 'true',
      }));

      const taskSuccess = await createTask({
        training_course: trainingCourse,
        username: username,
        updates: updates,
      });

      if (taskSuccess) {
        let uncheckedSuccess = true;

        // 미체크 항목들을 uncheckedDescriptionsCreate로 전송
        if (unchecked.length > 0) {
          const uncheckedPromises = unchecked
            .map(uncheckedItem => {
              const task = periodicTasks.find(
                t => t.id === uncheckedItem.task_id
              );
              if (task) {
                return apiClient.uncheckedDescriptions.uncheckedDescriptionsCreate(
                  {
                    description: task.task_name || '', // task_name을 description로
                    action_plan: uncheckedItem.reason, // 사유를 action_plan으로
                    training_course: trainingCourse,
                  }
                );
              }
              return null;
            })
            .filter(Boolean);

          if (uncheckedPromises.length > 0) {
            try {
              await Promise.all(uncheckedPromises);
              console.log('미체크 항목들이 성공적으로 등록되었습니다.');
            } catch (error) {
              console.error('미체크 항목 등록 중 오류:', error);
              uncheckedSuccess = false;
            }
          }
        }

        if (uncheckedSuccess) {
          alert('체크리스트와 미완료 사유가 모두 성공적으로 등록되었습니다!');
        } else {
          alert('체크리스트는 저장되었지만, 미완료 사유 등록에 실패했습니다.');
        }

        // 성공 후 폼 초기화
        resetPeriodicForm();
      } else {
        alert('체크리스트 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('체크리스트 등록 중 오류가 발생했습니다:', error);
      alert('체크리스트 등록 중 오류가 발생했습니다.');
    }
  };

  const noCheckedCount = Object.values(periodicSelectedValues).filter(
    value => value === 'false'
  ).length;

  if (isLoading) {
    return (
      <Card>
        <LoadingSpinner
          className="h-32"
          message="체크리스트를 불러오는 중..."
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <ErrorState className="h-32" message={error} />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between pb-4">
        <h3 className="font-semibold xl:text-lg mb-2">기간별 체크리스트</h3>
        <Select
          value={currentPeriodicPeriod || ''}
          onValueChange={handlePeriodChange}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="기간 선택" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!currentPeriodicPeriod ? (
        <EmptyState
          className="h-32"
          title="기간을 선택해주세요"
          message="위의 드롭다운에서 기간을 선택해주세요."
        />
      ) : periodicTasks.length === 0 ? (
        <EmptyState
          className="h-32"
          title={`${currentPeriodicPeriod} 체크리스트가 없습니다`}
          message={`현재 등록된 ${currentPeriodicPeriod} 체크리스트가 없습니다.`}
        />
      ) : (
        <>
          {Object.entries(groupedData).map(([category, items]) => (
            <div
              key={category}
              className="border-b border-border last:border-b-0"
            >
              <h4 className="font-semibold xl:text-lg text-primary p-4 pb-2 pt-2">
                #{category}
              </h4>
              {items.map(item => (
                <CheckListItem
                  key={item.id}
                  item={item}
                  selectedValue={
                    periodicSelectedValues[item.id?.toString() || ''] || ''
                  }
                  reason={periodicReasons[item.id?.toString() || ''] || ''}
                  onValueChange={handleValueChange}
                  onInputChange={handleInputChange}
                />
              ))}
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-4 mr-4">
              <p className="text-sm xl:text-base text-muted-foreground">
                미완료: {noCheckedCount}개
              </p>
            </div>
            <Button className="w-20 font-semibold" onClick={handleSubmit}>
              저장
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export default PeriodicCheckList;
