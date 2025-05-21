import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MarkedCalender({
  markedDates = [],
  currentMonth,
  onMonthChange,
}) {
  const monthYearString = useMemo(() => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onMonthChange(nextMonth);
  };

  const calendarDays = useMemo(() => {
    const days = [];

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );

    const firstDayOfWeek = firstDayOfMonth.getDay();

    const lastDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const daysInMonth = lastDayOfMonth.getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dateString = date.toISOString().split('T')[0];

      const isMarked = markedDates.includes(dateString);

      days.push({
        day,
        date: dateString,
        isMarked,
      });
    }

    return days;
  }, [currentMonth, markedDates]);

  // Array of weekday names
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='w-full max-w-md mx-auto bg-white rounded-lg shadow'>
      {/* Calendar header */}
      <div className='flex items-center justify-between p-4 border-b'>
        <button
          onClick={handlePrevMonth}
          className='p-2 rounded-md hover:bg-gray-100 transition-colors'
          aria-label='Previous month'>
          <ChevronLeft className='h-5 w-5' />
        </button>

        <h2 className='text-lg font-semibold'>{monthYearString}</h2>

        <button
          onClick={handleNextMonth}
          className='p-2 rounded-md hover:bg-gray-100 transition-colors'
          aria-label='Next month'>
          <ChevronRight className='h-5 w-5' />
        </button>
      </div>

      {/* Calendar grid */}
      <div className='p-4'>
        {/* Weekday headers */}
        <div className='grid grid-cols-7 gap-1 mb-2'>
          {weekdays.map((day) => (
            <div
              key={day}
              className='text-center text-sm font-medium text-gray-500'>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className='grid grid-cols-7 gap-1'>
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-md
                ${!dayData ? 'text-gray-300' : 'text-gray-700'}
                ${
                  dayData?.isMarked
                    ? 'bg-red-300 font-medium'
                    : 'hover:bg-gray-100'
                }
              `}>
              {dayData?.day}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className='p-4 border-t text-sm text-gray-600 flex items-center'>
        <div className='w-4 h-4 bg-red-300 rounded-sm mr-2'></div>
        <span>Red marked is booked date</span>
      </div>
    </div>
  );
}
