import React, { useState } from 'react';

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
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
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
      shift
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

  const getDaySchedules = (date) => {
    return schedules.filter(schedule => 
      schedule.date.toDateString() === date.toDateString()
    );
  };

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="w-full h-screen p-4 bg-gray-50">
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        {/* Worker Management Section */}
        <div className="w-96 p-4 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4">근무자 관리</h2>
          <div className="flex flex-col gap-2">
            <input
              className="w-full p-2 border rounded"
              placeholder="이름"
              value={newWorker.name}
              onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="직책"
              value={newWorker.position}
              onChange={(e) => setNewWorker({...newWorker, position: e.target.value})}
            />
            <button 
              onClick={handleAddWorker}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              근무자 추가
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">근무자 목록</h3>
            <div className="space-y-2">
              {workers.map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{worker.name}</span>
                    <span className="text-gray-500 ml-2">({worker.position})</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleAddSchedule(worker.id, 'day')}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      주간
                    </button>
                    <button 
                      onClick={() => handleAddSchedule(worker.id, 'night')}
                      className="px-2 py-1 bg-purple-500 text-white rounded text-sm"
                    >
                      야간
                    </button>
                    <button 
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="flex-1 border rounded-lg bg-white shadow flex flex-col h-full">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <h2 className="text-xl font-bold">
                {date.getFullYear()}년 {date.getMonth() + 1}월
              </h2>
              <button 
                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b flex-shrink-0">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-semibold bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-1 overflow-auto">
            {createCalendarDays().map((day, index) => {
              const daySchedules = getDaySchedules(day.date);
              return (
                <div 
                  key={index}
                  onClick={() => setDate(new Date(day.date))}
                  className={`
                    h-32 p-2 border-b border-r relative
                    ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                    ${day.date.toDateString() === date.toDateString() ? 'bg-blue-50' : ''}
                    hover:bg-gray-50 cursor-pointer
                  `}
                >
                  <div className="font-medium mb-1">{day.date.getDate()}</div>
                  <div className="space-y-1">
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
                          {worker?.name} ({schedule.shift === 'day' ? '주간' : '야간'})
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Schedule Details */}
      {getDaySchedules(date).length > 0 && (
        <div className="mx-4 mb-4 p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">
            {date.toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} 근무 일정
          </h3>
          <div className="space-y-2">
            {getDaySchedules(date).map((schedule, index) => {
              const worker = workers.find(w => w.id === schedule.workerId);
              return (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{worker?.name}</span>
                    <span className="text-gray-500 ml-2">
                      {schedule.shift === 'day' ? '주간' : '야간'} 근무
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteSchedule(schedule.workerId, schedule.date)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
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
  );
};

export default WorkScheduleDisplay;
