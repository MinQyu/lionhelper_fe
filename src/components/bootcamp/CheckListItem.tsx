import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { useState } from 'react';

interface CheckListItemProps {
  item: {
    id?: number;
    guide?: string;
    task_category?: string;
    task_name?: string;
    task_period?: string;
  };
  selectedValue: string;
  reason: string;
  onValueChange: (itemId: number, value: string) => void;
  onInputChange: (itemId: number, reason: string) => void;
}

function CheckListItem({
  item,
  selectedValue,
  reason,
  onValueChange,
  onInputChange,
}: CheckListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-2 pl-8 border-b border-border last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-medium">{item.task_name}</p>
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
            {isHovered && (
              <div className="absolute left-6 top-0 z-50 p-3 bg-popover border border-border rounded-md shadow-lg min-w-max max-w-xs">
                <p className="text-sm xl:text-base text-center whitespace-normal">
                  {item.guide}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <RadioGroup
            value={selectedValue}
            onValueChange={value => onValueChange(item.id!, value)}
          >
            <div className="flex flex-row items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="true"
                  id={`yes-${item.id}`}
                  label="YES"
                />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`no-${item.id}`} label="NO" />
              </div>
            </div>
          </RadioGroup>
          {selectedValue === 'false' && (
            <div className="flex-1">
              <Input
                placeholder="사유를 입력해주세요"
                value={reason}
                onChange={e => onInputChange(item.id!, e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckListItem;
