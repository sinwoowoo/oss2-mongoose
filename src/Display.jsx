import React, { useState } from 'react';

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
      shift
    };
    setSchedules([...schedules, newSchedule]);
  };

  const getDaySchedules = (date) => {
    return schedules.filter(schedule => 
      schedule.date.toDateString() === date.toDateString()
    );
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

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex space-x-4">
        <div className="w-1/2 p-4 border rounded-lg bg-white shadow">
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

        <div className="w-1/2 p-4 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4">근무 일정</h2>
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="mt-4">
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
              )})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleDisplay;
