import DailyAttendance from '@/components/bootcamp/DailyAttendance';
import DailyCheckList from '@/components/bootcamp/DailyCheckList';

function DailyTaskTab() {
  return (
    <div className="space-y-4">
      <DailyAttendance />
      <DailyCheckList />
    </div>
  );
}

export default DailyTaskTab;
