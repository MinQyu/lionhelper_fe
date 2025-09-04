import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/api/apiClient';
import { useAuthStore } from '@/store/authStore';

interface IssueProps {
  id?: number;
  content: string;
  created_by?: string;
  created_at?: string;
  comments?: {
    id?: number;
    comment?: string;
    created_by?: string;
    created_at?: string;
  }[];
  onResolve?: () => void;
  onCommentAdded?: () => void;
}

function Issue({
  id,
  content,
  created_by,
  created_at,
  comments,
  onResolve,
  onCommentAdded,
}: IssueProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const {
    user: { username },
  } = useAuthStore() as { user: { username: string } };

  const handleResolve = async () => {
    if (!id) return;

    try {
      setIsResolving(true);
      await apiClient.issues.resolveCreate({
        issue_id: id,
      });
      alert('이슈가 해결되었습니다.');
      onResolve?.();
    } catch (error) {
      console.error('이슈 해결 실패:', error);
      alert('서버 통신에 실패했습니다.');
    } finally {
      setIsResolving(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!id || !newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      await apiClient.issues.commentsCreate({
        issue_id: id,
        comment: newComment.trim(),
        username: username,
      });
      alert('댓글이 등록되었습니다.');
      setNewComment('');
      setShowComments(true);
      onCommentAdded?.();
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // 줄 시작에 '-'이 있는 경우 글머리기호로 변환
      if (line.trim().startsWith('-')) {
        const text = line.trim().substring(1).trim();
        return (
          <div key={index} className="flex mb-1">
            <span className="text-primary mr-2 flex-shrink-0 leading-6 xl:leading-8">
              •
            </span>
            <span className="leading-6 xl:leading-8">{text}</span>
          </div>
        );
      }
      return (
        <div key={index} className="leading-6 xl:leading-8">
          {line}
        </div>
      );
    });
  };

  return (
    <Card variant="outlined">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-sm xl:text-base text-gray-600 mb-1">
            <span className="font-medium">작성자:</span> {created_by}
          </div>
          <div className="text-sm xl:text-base text-gray-600 mb-2">
            <span className="font-medium">날짜:</span>{' '}
            {created_at ? new Date(created_at).toLocaleString('ko-KR') : ''}
          </div>
          <div className="text-sm xl:text-base text-gray-900">
            {formatContent(content || '')}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="default"
            onClick={handleResolve}
            disabled={isResolving}
          >
            해결
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowComments(!showComments)}
          >
            댓글 {comments?.length || 0}
          </Button>
        </div>
      </div>

      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm xl:text-base font-medium text-gray-700 mb-2">
            댓글:
          </div>

          {/* 댓글 목록 */}
          {comments && comments.length > 0 && (
            <div className="space-y-2 mb-4">
              {comments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded p-3 text-sm xl:text-base"
                >
                  <div className="text-gray-600 mb-1">
                    <span className="font-medium">{comment.created_by}</span>
                    <span className="text-gray-400 ml-2">
                      {comment.created_at
                        ? new Date(comment.created_at).toLocaleString('ko-KR')
                        : ''}
                    </span>
                  </div>
                  <div className="text-gray-900">
                    {formatContent(comment.comment || '')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 댓글 입력창 */}
          <div className="space-y-2">
            <textarea
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
              disabled={isSubmittingComment}
              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent p-3 text-sm xl:text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              style={{ whiteSpace: 'pre-line' }}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                className="w-20 font-semibold"
              >
                {isSubmittingComment ? '작성 중...' : '작성'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default Issue;
