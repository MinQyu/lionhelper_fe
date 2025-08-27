import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface Attendance {
  role: string;
  name: string;
  startTime: string;
  endTime: string;
}

function DailyAttendance() {
  const [records, setRecords] = useState<Attendance[]>([
    { role: '', name: '', startTime: '', endTime: '' },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const addRecord = () => {
    setRecords([
      ...records,
      { role: '', name: '', startTime: '', endTime: '' },
    ]);
  };

  const removeRecord = (index: number) => {
    if (records.length === 1) return; // 최소 1개는 남겨둠
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof Attendance,
    value: string
  ) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
  };

  const handleSubmit = () => {
    for (const rec of records) {
      if (!rec.role || !rec.name || !rec.startTime || !rec.endTime) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
    }
    setSubmitted(true);
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center xl:gap-3">
        <h3 className="font-bold">출퇴근 기록</h3>
        {!submitted && (
          <Button
            className="w-6 h-6 p-1 xl:w-7 xl:h-7 xl:p-2"
            variant="outline"
            onClick={addRecord}
          >
            <PlusIcon size={14} />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {records.map((rec, index) => (
          <div
            key={index}
            className="flex flex-row gap-2 p-2 border-1 border-border rounded-lg items-center xl:gap-3 xl:p-3 xl:text-lg"
          >
            <div className="flex flex-row gap-2 items-center flex-1">
              <Select
                disabled={submitted}
                value={rec.role}
                onValueChange={value => handleChange(index, 'role', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="직급" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="주강사">주강사</SelectItem>
                  <SelectItem value="보조강사">보조강사</SelectItem>
                </SelectContent>
              </Select>

              <Input
                disabled={submitted}
                placeholder="이름"
                value={rec.name}
                onChange={e => handleChange(index, 'name', e.target.value)}
                className="w-32 text-center xl:w-40 xl:text-lg"
              />
              <Input
                disabled={submitted}
                type="time"
                placeholder="출근시간"
                value={rec.startTime}
                onChange={e => handleChange(index, 'startTime', e.target.value)}
                className="w-36 text-center xl:w-40 xl:text-lg"
              />
              <Input
                disabled={submitted}
                type="time"
                placeholder="퇴근시간"
                value={rec.endTime}
                onChange={e => handleChange(index, 'endTime', e.target.value)}
                className="w-36 text-center xl:w-40 xl:text-lg"
              />
            </div>

            {!submitted && (
              <Button
                variant="destructive"
                className="w-6 h-6 p-1 mr-2 xl:w-7 xl:h-7 xl:p-2 xl:mr-3"
                onClick={() => removeRecord(index)}
              >
                <MinusIcon size={14} />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          className="w-20 font-semibold"
          onClick={handleSubmit}
          disabled={submitted}
        >
          등록
        </Button>
      </div>
    </Card>
  );
}

export default DailyAttendance;
