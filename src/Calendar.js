import React from 'react';

const Calendar = ({ 
  value = new Date(),
  onChange,
  renderContent,
  className = ''
}) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const createCalendarDays = () => {
    const year = value.getFullYear();
    const month = value.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    onChange(new Date(value.getFullYear(), value.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onChange(new Date(value.getFullYear(), value.getMonth() + 1, 1));
  };

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Calendar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h2 className="text-xl font-bold">
            {value.getFullYear()}년 {monthNames[value.getMonth()]}
          </h2>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Day Names */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {createCalendarDays().map((day, index) => {
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isSelected = day.date.toDateString() === value.toDateString();

            return (
              <div 
                key={index}
                onClick={() => onChange(new Date(day.date))}
                className={`
                  p-2 border-b border-r relative
                  ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isToday ? 'bg-blue-50' : ''}
                  ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                  hover:bg-gray-50 cursor-pointer
                `}
              >
                <div className="font-medium">{day.date.getDate()}</div>
                {renderContent && renderContent(day.date)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
