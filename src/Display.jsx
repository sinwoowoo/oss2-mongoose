import React, { useState } from 'react';
import Calendar from './Calendar';

const WorkScheduleDisplay = () => {
  const [date, setDate] = useState(new Date());
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: '', position: '' });

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

  const renderCalendarContent = (date) => {
    const daySchedules = getDaySchedules(date);
    if (daySchedules.length === 0) return null;

    return (
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
    );
  };

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
          <Calendar
            value={date}
            onChange={setDate}
            renderContent={renderCalendarContent}
          />

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
