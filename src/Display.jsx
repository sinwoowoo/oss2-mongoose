import React, { useState } from 'react';

const WorkScheduleDisplay = () => {
  const [date, setDate] = useState(new Date());
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: '', position: '' });

  // 달력 관련 함수들
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

    // 이전 달의 날짜들
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - days.length; // 6주 달력을 위해
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const getDaySchedules = (date) => {
    return schedules.filter(schedule => 
      schedule.date.toDateString() === date.toDateString()
    );
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

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex space-x-4">
        <div className="w-1/3 p-4 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4">근무자 관리</h2>
          <div className="flex flex-col space-y-2">
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
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAddSchedule(worker.id, 'day')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      주간
                    </button>
                    <button 
                      onClick={() => handleAddSchedule(worker.id, 'night')}
                      className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                    >
                      야간
                    </button>
                    <button 
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-2/3 p-4 border rounded-lg bg-white shadow">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              ←
            </button>
            <h2 className="text-xl font-bold">
              {date.getFullYear()}년 {monthNames[date.getMonth()]}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(day => (
              <div key={day} className="text-center p-2 font-bold bg-gray-100">
                {day}
              </div>
            ))}
            {createCalendarDays().map((day, index) => {
              const daySchedules = getDaySchedules(day.date);
              return (
                <div 
                  key={index}
                  className={`min-h-24 p-1 border ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    day.date.toDateString() === date.toDateString() ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setDate(new Date(day.date))}
                >
                  <div className="font-medium text-sm">
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {daySchedules.map((schedule, idx) => {
                      const worker = workers.find(w => w.id === schedule.workerId);
                      return (
                        <div 
                          key={idx}
                          className={`text-xs p-1 rounded ${
                            schedule.shift === 'day' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
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

          {getDaySchedules(date).length > 0 && (
            <div className="mt-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">
                {date.toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 근무 일정
              </h3>
              {getDaySchedules(date).map((schedule, index) => {
                const worker = workers.find(w => w.id === schedule.workerId);
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                    <div>
                      <span className="font-medium">{worker?.name}</span>
                      <span className="text-gray-500 ml-2">
                        {schedule.shift === 'day' ? '주간' : '야간'} 근무
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSchedule(schedule.workerId, schedule.date)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleDisplay;
