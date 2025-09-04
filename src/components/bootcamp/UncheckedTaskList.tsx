import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export type UncheckedDescription = NonNullable<
  NonNullable<
    Awaited<
      ReturnType<
        typeof apiClient.uncheckedDescriptions.uncheckedDescriptionsList
      >
    >['data']
  >['data']
>[number];

interface UncheckedTaskListProps {
  showCourseFilter?: boolean;
  selectedCourse?: string;
  onCourseChange?: (course: string) => void;
  courseFilter?: string;
}

function UncheckedTaskList({
  showCourseFilter = false,
  selectedCourse = 'all',
  onCourseChange,
  courseFilter,
}: UncheckedTaskListProps) {
  const [data, setData] = useState<UncheckedDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [resolveInputs, setResolveInputs] = useState<Record<number, string>>(
    {}
  );
  const [resolvingItems, setResolvingItems] = useState<Set<number>>(new Set());

  const fetchUncheckedDescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await apiClient.uncheckedDescriptions.uncheckedDescriptionsList();
      if (response.data.success && response.data.data) {
        let filteredData = response.data.data;

        if (courseFilter) {
          filteredData = response.data.data.filter(
            item => item.training_course === courseFilter
          );
        }

        setData(filteredData);
        setError(null);
      } else {
        setError('미체크 항목을 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('미체크 항목 조회 실패:', err);
      setError('미체크 항목을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [courseFilter]);

  useEffect(() => {
    fetchUncheckedDescriptions();
  }, [fetchUncheckedDescriptions]);

  const getAvailableCourses = () => {
    const courses = data
      .map(item => item.training_course)
      .filter((course): course is string => Boolean(course));
    return Array.from(new Set(courses));
  };

  const filteredData =
    selectedCourse === 'all'
      ? data
      : data.filter(item => item.training_course === selectedCourse);

  const toggleExpanded = (itemId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleResolveInputChange = (itemId: number, value: string) => {
    setResolveInputs(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleResolve = async (itemId: number) => {
    const resolveText = resolveInputs[itemId]?.trim();
    if (!resolveText) {
      alert('해결 방안을 입력해주세요.');
      return;
    }

    try {
      setResolvingItems(prev => new Set(prev).add(itemId));

      await apiClient.uncheckedDescriptions.resolveCreate({
        unchecked_id: itemId,
      });

      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      setResolveInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[itemId];
        return newInputs;
      });

      alert('미체크 항목이 해결되었습니다.');

      fetchUncheckedDescriptions();
    } catch (error) {
      console.error('해결 처리 중 오류:', error);
      alert('해결 처리 중 오류가 발생했습니다.');
    } finally {
      setResolvingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pt-16">
        <LoadingSpinner
          className="h-64"
          message="미체크 항목을 불러오는 중..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState className="h-32" message={error} />
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <EmptyState
        className="h-32"
        title="미체크 항목이 없습니다"
        message="현재 미체크된 항목이 없습니다."
      />
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="xl:text-lg font-semibold">미체크 항목</h2>
        {showCourseFilter && (
          <div className="flex items-center gap-2">
            <Select value={selectedCourse} onValueChange={onCourseChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과정을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {getAvailableCourses().map(course => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="border-2 border-border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap w-[10%]">
                생성일
              </th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap w-[20%]">
                훈련 과정
              </th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap w-[50%]">
                내용
              </th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap w-[20%]">
                마감일(지연일)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <>
                <tr
                  key={item.id}
                  className="border-t border-border hover:bg-muted/70 transition-colors cursor-pointer"
                  onClick={() => toggleExpanded(item.id || 0)}
                >
                  <td className="px-4 py-3 text-center text-sm xl:text-base whitespace-nowrap">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString('ko-KR')
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm xl:text-base">
                    {item.training_course}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-full">
                      <div className="font-medium text-sm xl:text-base mb-1">
                        {item.content}
                      </div>
                      {item.action_plan && (
                        <div className="text-sm xl:text-base text-muted-foreground">
                          {item.action_plan}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm xl:text-base">
                    {item.deadline ? (
                      <div>
                        <div>{item.deadline}</div>
                        {item.due_days !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            (
                            {item.due_days > 0
                              ? `+${item.due_days}일`
                              : item.due_days < 0
                                ? `${item.due_days}일`
                                : '당일'}
                            )
                          </div>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
                {expandedItems.has(item.id || 0) && (
                  <tr
                    key={`${item.id}-expand`}
                    className="border-t border-border bg-muted/5"
                  >
                    <td colSpan={4} className="px-4 py-4">
                      <div className="flex items-center gap-3 pl-8">
                        <div className="text-muted-foreground text-lg">└</div>
                        <Input
                          placeholder="해결 방안을 입력하세요..."
                          value={resolveInputs[item.id || 0] || ''}
                          onChange={e =>
                            handleResolveInputChange(
                              item.id || 0,
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            toggleExpanded(item.id || 0);
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleResolve(item.id || 0);
                          }}
                          disabled={resolvingItems.has(item.id || 0)}
                        >
                          {resolvingItems.has(item.id || 0)
                            ? '처리 중...'
                            : '해결'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default UncheckedTaskList;
