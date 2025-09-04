import { useState } from 'react';
import UncheckedTaskList from '@/components/bootcamp/UncheckedTaskList';

function UncheckedTaskTab() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  return (
    <div>
      <UncheckedTaskList
        showCourseFilter={true}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
      />
    </div>
  );
}

export default UncheckedTaskTab;
