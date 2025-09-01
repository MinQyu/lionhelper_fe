import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CheckListItem from './CheckListItem';
import { useCheckListStore } from '@/store/checkListStore';
import { apiClient } from '@/api/apiClient';

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

  // URL 파라미터에서 training_course 가져오기
  const trainingCourse = CourseName as string;

  // daily period 체크리스트만 필터링하고 id가 있는 항목만 포함
  const dailyTasks = tasks.filter(
    task => task.task_period === 'daily' && task.id
  );

  // 컴포넌트 마운트 시 체크리스트 데이터 로드
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
          username: '더미 사용자', // 나중에 전역 상태에서 가져올 값
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
      // 체크된 항목들을 createTask로 전송
      const updates = dailyTasks.map(item => ({
        task_name: item.task_name || '',
        is_checked: selectedValues[item.id?.toString() || ''] === 'true',
      }));

      const success = await createTask({
        training_course: trainingCourse,
        username: '더미 사용자', // 나중에 전역 상태에서 가져올 값
        updates: updates,
      });

      if (success) {
        // 미체크 항목들을 uncheckedDescriptionsCreate로 전송
        if (unchecked.length > 0) {
          const uncheckedPromises = unchecked
            .map(uncheckedItem => {
              const task = dailyTasks.find(t => t.id === uncheckedItem.task_id);
              if (task) {
                return apiClient.uncheckedDescriptions.uncheckedDescriptionsCreate(
                  {
                    content: task.task_name || '', // task_name을 content로
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
              console.log('미체크 항목들이 성공적으로 저장되었습니다.');
            } catch (error) {
              console.error('미체크 항목 저장 중 오류:', error);
            }
          }
        }

        alert('체크리스트가 성공적으로 저장되었습니다!');
        // 성공 후 폼 초기화
        resetForm();
      } else {
        alert('체크리스트 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('체크리스트 저장 중 오류가 발생했습니다:', error);
      alert('체크리스트 저장 중 오류가 발생했습니다.');
    }
  };

  const noCheckedCount = Object.values(selectedValues).filter(
    value => value === 'false'
  ).length;

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">체크리스트를 불러오는 중...</p>
          </div>
        </div>
      </Card>
    );
  }

  // 에러가 있을 때 표시
  if (error) {
    return (
      <Card>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-destructive">
              오류가 발생했습니다
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  // 데이터가 없을 때 표시
  if (dailyTasks.length === 0) {
    return (
      <Card>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              일일 체크리스트가 없습니다
            </h3>
            <p className="text-muted-foreground">
              현재 등록된 일일 체크리스트가 없습니다.
            </p>
          </div>
        </div>
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
