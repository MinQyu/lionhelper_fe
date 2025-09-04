import { useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import IssueList from '@/components/bootcamp/IssueList';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';

export type IssuesResponse = NonNullable<
  Awaited<ReturnType<typeof apiClient.issues.issuesList>>['data']
>;

function IssuesTab() {
  const [issuesData, setIssuesData] = useState<IssuesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await apiClient.issues.issuesList();
      setIssuesData(response.data);
      setError(null);
    } catch (err) {
      console.error('이슈 목록 조회 실패:', err);
      setError('이슈 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const getAvailableCourses = () => {
    if (!issuesData?.data) return [];
    return issuesData.data
      .map(courseData => courseData.training_course)
      .filter((course): course is string => Boolean(course));
  };

  if (loading) {
    return (
      <div className="space-y-6 pt-16">
        <LoadingSpinner className="h-64" message="이슈를 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">이슈 관리</h2>
        <ErrorState className="h-32" message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">이슈 목록</h3>
          <div className="flex items-center gap-2">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
        </div>
        {selectedCourse === 'all' ? (
          <div className="space-y-6">
            {issuesData?.data?.map((courseData, courseIndex) => (
              <Card key={courseIndex}>
                <h3 className="xl:text-lg font-medium text-primary mb-3">
                  {courseData.training_course}
                </h3>
                <IssueList
                  courseName={courseData.training_course || ''}
                  showHeader={false}
                />
              </Card>
            ))}
          </div>
        ) : (
          <IssueList courseName={selectedCourse} showHeader={false} />
        )}
      </Card>
    </div>
  );
}

export default IssuesTab;
