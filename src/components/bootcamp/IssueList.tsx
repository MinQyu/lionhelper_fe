import { useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { Card } from '@/components/ui/card';
import IssueItem from '@/components/bootcamp/IssueItem';

export type IssuesResponse = NonNullable<
  Awaited<ReturnType<typeof apiClient.issues.issuesList>>['data']
>;

interface IssueListProps {
  courseName: string;
  showHeader?: boolean;
}

function IssueList({ courseName, showHeader = true }: IssueListProps) {
  const [issuesData, setIssuesData] = useState<IssuesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleIssueResolve = () => {
    // 이슈가 해결되면 목록을 새로고침
    fetchIssues();
  };

  const handleCommentAdded = () => {
    // 댓글이 추가되면 목록을 새로고침
    fetchIssues();
  };

  // 특정 과정의 이슈만 필터링
  const getCourseIssues = () => {
    if (!issuesData?.data) return [];

    const courseData = issuesData.data.find(
      data => data.training_course === courseName
    );

    return courseData?.issues || [];
  };

  if (loading) {
    return (
      <div className="space-y-6 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">이슈를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">이슈 관리</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    );
  }

  const courseIssues = getCourseIssues();

  const content = (
    <>
      {showHeader && <h3 className="font-semibold">이슈 목록</h3>}
      {courseIssues.length > 0 ? (
        <div className="space-y-3">
          {courseIssues.map(issue => (
            <IssueItem
              key={issue.id}
              id={issue.id}
              content={issue.content || ''}
              created_by={issue.created_by}
              created_at={issue.created_at}
              comments={issue.comments}
              onResolve={handleIssueResolve}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          등록된 이슈가 없습니다.
        </div>
      )}
    </>
  );

  return showHeader ? (
    <Card className="space-y-4">{content}</Card>
  ) : (
    <div className="space-y-4">{content}</div>
  );
}

export default IssueList;
