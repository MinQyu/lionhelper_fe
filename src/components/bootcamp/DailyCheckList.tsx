import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CheckListItem from './CheckListItem';

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

const mockData = [
  {
    id: 1,
    guide: '업무 가이드',
    task_category: '일반',
    task_name: '출석 체크',
    task_period: 'daily',
  },
  {
    id: 2,
    guide: '업무 가이드',
    task_category: '개발',
    task_name: '과제 제출',
    task_period: 'daily',
  },
  {
    id: 3,
    guide: '업무 가이드',
    task_category: '교육 운영',
    task_name: '특이자 확인',
    task_period: 'daily',
  },
  {
    id: 4,
    guide: '업무 가이드',
    task_category: '교육 운영',
    task_name: '녹화본 확인',
    task_period: 'daily',
  },
];

function DailyCheckList() {
  const { CourseName } = useParams<{ CourseName: string }>();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );
  const [reasons, setReasons] = useState<Record<string, string>>({});

  // URL 파라미터에서 training_course 가져오기
  const trainingCourse = CourseName as string;

  const groupedData = mockData.reduce(
    (acc, item) => {
      if (!acc[item.task_category]) {
        acc[item.task_category] = [];
      }
      acc[item.task_category].push(item);
      return acc;
    },
    {} as Record<string, typeof mockData>
  );

  const handleValueChange = (itemId: number, value: string) => {
    setSelectedValues(prev => ({ ...prev, [itemId.toString()]: value }));
    if (value === 'true') {
      setReasons(prev => {
        const newReasons = { ...prev };
        delete newReasons[itemId.toString()];
        return newReasons;
      });
    }
  };

  const handleInputChange = (itemId: number, reason: string) => {
    setReasons(prev => ({ ...prev, [itemId.toString()]: reason }));
  };

  // 체크리스트 데이터를 TaskCheckList 형태로 변환
  const prepareTaskCheckList = () => {
    const checkList: TaskCheckList[] = [];
    const unchecked: UncheckedTask[] = [];

    mockData.forEach(item => {
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
    });

    // 데이터를 반환하여 즉시 사용할 수 있도록 함
    return { checkList, unchecked };
  };

  const handleSubmit = async () => {
    // 모든 항목이 체크되었는지 확인
    const totalItems = mockData.length;
    const checkedItems = Object.keys(selectedValues).length;

    if (checkedItems < totalItems) {
      alert('모든 체크리스트 항목을 작성해주세요.');
      return;
    }

    const { checkList, unchecked } = prepareTaskCheckList();
    console.log('체크리스트 데이터:', checkList);
    console.log('미체크 항목:', unchecked);

    // try {
    //   const response = await fetch('/api/task-checklist', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       taskCheckList: checkList,
    //       uncheckedTasks: unchecked,
    //     }),
    //   });

    //   if (response.ok) {
    //     console.log('체크리스트가 성공적으로 저장되었습니다.');
    //     // 성공 처리 로직 추가
    //   } else {
    //     console.error('체크리스트 저장에 실패했습니다.');
    //     // 에러 처리 로직 추가
    //   }
    // } catch (error) {
    //   console.error('체크리스트 저장 중 오류가 발생했습니다:', error);
    //   // 에러 처리 로직 추가
    // }
  };

  const noCheckedCount = Object.values(selectedValues).filter(
    value => value === 'false'
  ).length;

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
              selectedValue={selectedValues[item.id] || ''}
              reason={reasons[item.id] || ''}
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
