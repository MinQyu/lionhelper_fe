import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';
import { useAuthStore } from '@/store/authStore';

function IssueRegister() {
  const { CourseName } = useParams<{ CourseName: string }>();
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: 커스텀 훅으로 전역에서 username 가져오기
  const {
    user: { username },
  } = useAuthStore() as { user: { username: string } };

  const placeholder = `이슈사항을 입력해주세요
작성 예시: 
- 배경: 이슈가 발생한 배경
- 상황: 이슈 상황`;

  // 전역 API 클라이언트 사용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('이슈 내용을 입력해주세요.');
      return;
    }

    if (!CourseName) {
      alert('교육 과정 정보를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.issues.issuesCreate({
        issue: content.trim(),
        training_course: CourseName,
        username: username,
        date: date || undefined,
      });

      if (response.data.success) {
        alert('이슈가 성공적으로 생성되었습니다!');
        setContent('');
        setDate('');
      }
    } catch (error: unknown) {
      console.error('이슈 생성 오류:', error);

      alert('이슈 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="font-semibold xl:text-lg">이슈 등록</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={placeholder}
          required
          disabled={isLoading}
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent p-3 text-sm xl:text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] xl:min-h-[200px] resize-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          style={{ whiteSpace: 'pre-line' }}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-20 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default IssueRegister;
