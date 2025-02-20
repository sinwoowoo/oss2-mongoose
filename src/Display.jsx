import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WorkScheduleDisplay = () => {
  const [date, setDate] = useState(new Date());
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: '', position: '' });

  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const createCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
    const remainingDays = 42 - days.length; // Always show 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.position) {
      const worker = {
        id: Math.random().toString(36).substr(2, 9),
        name: newWorker.name,
        position: newWorker.position
      };
      setWorkers([...workers, worker]);
      setNewWorker({ name: '', position: '' });
    }
  };

  const handleAddSchedule = (workerId, shift) => {
    const newSchedule = {
      date: date,
      workerId,
      shift,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteWorker = (workerId) => {
    setWorkers(workers.filter(worker => worker.id !== workerId));
    setSchedules(schedules.filter(schedule => schedule.workerId !== workerId));
  };

  const handleDeleteSchedule = (workerId, selectedDate) => {
    setSchedules(schedules.filter(schedule => 
      !(schedule.workerId === workerId && 
        schedule.date.toDateString() === selectedDate.toDateString())
    ));
  };

  const getDaySchedules = (targetDate) => {
    return schedules.filter(schedule => 
      schedule.date.toDateString() === targetDate.toDateString()
    );
  };

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  return (
    <div className="w-full h-screen p-4 bg-gray-50">
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        {/* Worker Management Panel - Minimized */}
        <div className="w-72 p-4 border rounded-lg bg-white shadow shrink-0">
          <h2 className="text-lg font-bold mb-2">근무자 관리</h2>
          <div className="flex flex-col gap-1">
            <input
              className="w-full p-1 border rounded text-sm"
              placeholder="이름"
              value={newWorker.name}
              onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
            />
            <input
              className="w-full p-1 border rounded text-sm"
              placeholder="직책"
              value={newWorker.position}
              onChange={(e) => setNewWorker({...newWorker, position: e.target.value})}
            />
            <button 
              onClick={handleAddWorker}
              className="w-full p-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              추가
            </button>
          </div>

          <div className="mt-2">
            <h3 className="text-sm font-semibold mb-1">근무자 목록</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {workers.map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-1 bg-gray-50 rounded text-sm">
                  <div className="flex-1 truncate">
                    <span className="font-medium">{worker.name}</span>
                    <span className="text-gray-500 ml-1">({worker.position})</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleAddSchedule(worker.id, 'day')}
                      className="px-1 py-0.5 bg-blue-500 text-white rounded text-xs"
                    >
                      주
                    </button>
                    <button 
                      onClick={() => handleAddSchedule(worker.id, 'night')}
                      className="px-1 py-0.5 bg-purple-500 text-white rounded text-xs"
                    >
                      야
                    </button>
                    <button 
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="px-1 py-0.5 bg-red-500 text-white rounded text-xs"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Section - Expanded */}
        <div className="flex-1 border rounded-lg bg-white shadow flex flex-col">
          {/* Calendar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">
                {date.getFullYear()}년 {monthNames[date.getMonth()]}
              </h2>
              <button 
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5" />
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
                const daySchedules = getDaySchedules(day.date);
                const isToday = day.date.toDateString() === new Date().toDateString();
                const isSelected = day.date.toDateString() === date.toDateString();

                return (
                  <div 
                    key={index}
                    onClick={() => setDate(new Date(day.date))}
                    className={`
                      p-2 border-b border-r relative
                      ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                      ${isToday ? 'bg-blue-50' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                      hover:bg-gray-50 cursor-pointer
                    `}
                  >
                    <div className="font-medium">{day.date.getDate()}</div>
                    <div className="space-y-1 mt-1">
                      {daySchedules.map((schedule, idx) => {
                        const worker = workers.find(w => w.id === schedule.workerId);
                        return (
                          <div 
                            key={idx}
                            className={`
                              text-xs p-1 rounded truncate
                              ${schedule.shift === 'day' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'}
                            `}
                          >
                            {worker?.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Schedule Details */}
          {getDaySchedules(date).length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <h3 className="text-sm font-semibold mb-2">
                {date.toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 근무 일정
              </h3>
              <div className="space-y-1">
                {getDaySchedules(date).map((schedule, index) => {
                  const worker = workers.find(w => w.id === schedule.workerId);
                  return (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                      <div>
                        <span className="font-medium">{worker?.name}</span>
                        <span className="text-gray-500 ml-2">
                          {schedule.shift === 'day' ? '주간' : '야간'} 근무
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteSchedule(schedule.workerId, schedule.date)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        삭제
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleDisplay;
