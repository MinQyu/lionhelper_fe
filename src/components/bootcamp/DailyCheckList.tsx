import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  user_id: number;
}

interface UncheckedTask {
  task_id: number;
  reason: string;
}

function DailyCheckList() {
  const { CourseName } = useParams<{ CourseName: string }>();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    selectedValues,
    reasons,
    setSelectedValue,
    setReason,
    resetForm,
  } = useCheckListStore();
  const {
    user: { username },
  } = useAuthStore() as { user: { username: string } };

  const trainingCourse = CourseName as string;

  const dailyTasks = tasks.filter(
    task => task.task_period === 'daily' && task.id
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const groupedData = dailyTasks.reduce(
    (acc, item) => {
      if (!acc[item.task_category || '기타']) {
        acc[item.task_category || '기타'] = [];
      }
      acc[item.task_category || '기타'].push(item);
      return acc;
    },
    {} as Record<string, typeof dailyTasks>
  );

  const handleValueChange = (itemId: number, value: string) => {
    setSelectedValue(itemId, value);
    if (value === 'true') {
      // 체크된 경우 사유 제거
      setReason(itemId, '');
    }
  };

  const handleInputChange = (itemId: number, reason: string) => {
    setReason(itemId, reason);
  };

  // 체크리스트 데이터를 TaskCheckList 형태로 변환
  const prepareTaskCheckList = () => {
    const checkList: TaskCheckList[] = [];
    const unchecked: UncheckedTask[] = [];

    dailyTasks.forEach(item => {
      if (item.id) {
        const isChecked = selectedValues[item.id.toString()] === 'true';
        const checkedDate = new Date();

        checkList.push({
          task_id: item.id,
          training_course: trainingCourse,
          is_checked: isChecked,
          checked_date: checkedDate,
          username: username,
          user_id: 1, // 나중에 전역 상태에서 가져올 값
        });

        // 미체크 항목인 경우 사유와 함께 별도 객체로 관리
        if (!isChecked) {
          unchecked.push({
            task_id: item.id,
            reason: reasons[item.id.toString()] || '',
          });
        }
      }
    });

    return { checkList, unchecked };
  };

  const handleSubmit = async () => {
    // 모든 항목이 체크되었는지 확인
    const totalItems = dailyTasks.length;
    const checkedItems = Object.keys(selectedValues).length;

    if (checkedItems < totalItems) {
      alert('모든 체크리스트 항목을 작성해주세요.');
      return;
    }

    const { checkList, unchecked } = prepareTaskCheckList();
    console.log('체크리스트 데이터:', checkList);
    console.log('미체크 항목:', unchecked);

    try {
      const updates = dailyTasks.map(item => ({
        task_name: item.task_name || '',
        is_checked: selectedValues[item.id?.toString() || ''] === 'true',
      }));

      const taskSuccess = await createTask({
        training_course: trainingCourse,
        username: username,
        updates: updates,
      });

      if (taskSuccess) {
        let uncheckedSuccess = true;

        if (unchecked.length > 0) {
          const uncheckedPromises = unchecked
            .map(uncheckedItem => {
              const task = dailyTasks.find(t => t.id === uncheckedItem.task_id);
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
          alert('체크리스트와 미체크 항목 모두 성공적으로 등록되었습니다!');
        } else {
          alert('체크리스트는 저장되었지만, 미체크 항목 등록에 실패했습니다.');
        }

        resetForm();
      } else {
        alert('체크리스트 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('체크리스트 등록 중 오류가 발생했습니다:', error);
      alert('체크리스트 등록 중 오류가 발생했습니다.');
    }
  };

  const noCheckedCount = Object.values(selectedValues).filter(
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

  if (dailyTasks.length === 0) {
    return (
      <Card>
        <EmptyState
          className="h-32"
          title="일일 체크리스트가 없습니다"
          message="현재 등록된 일일 체크리스트가 없습니다."
        />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-bold pb-2">데일리 체크리스트</h3>
      {Object.entries(groupedData).map(([category, items]) => (
        <div key={category} className="border-b border-border last:border-b-0">
          <h4 className="font-semibold xl:text-lg text-primary p-4 pb-2 pt-2">
            #{category}
          </h4>
          {items.map(item => (
            <CheckListItem
              key={item.id}
              item={item}
              selectedValue={selectedValues[item.id?.toString() || ''] || ''}
              reason={reasons[item.id?.toString() || ''] || ''}
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
    </Card>
  );
}

export default DailyCheckList;
