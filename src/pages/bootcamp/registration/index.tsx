import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { apiClient } from '@/api/apiClient';
import { useBootcampStore } from '@/store/bootcampStore';
import { Save } from 'lucide-react';

const DEPARTMENTS = [
  { value: 'Pilot', label: 'Pilot' },
  { value: 'TechSol', label: 'TechSol' },
  { value: 'Dev', label: 'Dev' },
];

const COURSE_NAMES = [
  { value: '데이터 분석', label: '데이터 분석' },
  { value: '클라우드 엔지니어링', label: '클라우드 엔지니어링' },
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '백엔드:Python', label: '백엔드:Python' },
  { value: '백엔드:JAVA', label: '백엔드:JAVA' },
  { value: '그로스 마케팅', label: '그로스 마케팅' },
  { value: '앱 개발:Android', label: '앱 개발:Android' },
  { value: 'UI/UX 디자인', label: 'UI/UX 디자인' },
  { value: '유니티 게임 개발', label: '유니티 게임 개발' },
];

interface FormData {
  courseName: string;
  generation: string;
  dept: string;
  managerName: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

function BootcampRegistration() {
  const navigate = useNavigate();
  const { addCourse } = useBootcampStore();
  const [formData, setFormData] = useState<FormData>({
    courseName: '',
    generation: '',
    dept: '',
    managerName: '',
    startDate: undefined,
    endDate: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (
    field: keyof FormData,
    value: string | Date | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (
      !formData.courseName ||
      !formData.generation ||
      !formData.dept ||
      !formData.managerName ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (formData.startDate >= formData.endDate) {
      setError('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const trainingCourse = `${formData.courseName} ${formData.generation}기`;

      const formatDateToString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const response = await apiClient.trainingInfo.trainingInfoCreate({
        training_course: trainingCourse,
        dept: formData.dept,
        manager_name: formData.managerName,
        start_date: formatDateToString(formData.startDate!),
        end_date: formatDateToString(formData.endDate!),
      });

      if (response.data.success && response.data.data) {
        addCourse(response.data.data);
        alert('훈련과정이 성공적으로 등록되었습니다!');
        navigate('/bootcamp');
      } else {
        setError('훈련과정 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('훈련과정 등록 오류:', error);
      setError('훈련과정 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 mx-16">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="font-semibold xl:text-lg">훈련과정 등록</h3>
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          <Select
            value={formData.dept}
            onValueChange={value => handleInputChange('dept', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="부서를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map(dept => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={formData.courseName}
              onValueChange={value => handleInputChange('courseName', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="과정명을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_NAMES.map(course => (
                  <SelectItem key={course.value} value={course.value}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="generation"
              type="number"
              placeholder="기수를 입력하세요(숫자만 입력)"
              value={formData.generation}
              onChange={e => handleInputChange('generation', e.target.value)}
              min="1"
            />
          </div>

          <Input
            id="managerName"
            type="text"
            placeholder="담당자명을 입력하세요"
            value={formData.managerName}
            onChange={e => handleInputChange('managerName', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              date={formData.startDate}
              onDateChange={date => handleInputChange('startDate', date)}
              placeholder="시작일을 선택하세요"
              className="w-full"
            />

            <DatePicker
              date={formData.endDate}
              onDateChange={date => handleInputChange('endDate', date)}
              placeholder="종료일을 선택하세요"
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  등록 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mt-0.5" />
                  훈련과정 등록
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default BootcampRegistration;
