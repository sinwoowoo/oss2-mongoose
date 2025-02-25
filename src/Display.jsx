import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ko } from 'date-fns/locale';

const locales = {
  'ko': ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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
    const startDate = new Date(date);
    const endDate = new Date(date);
    
    if (shift === 'day') {
      startDate.setHours(9, 0, 0);
      endDate.setHours(18, 0, 0);
    } else {
      startDate.setHours(18, 0, 0);
      endDate.setHours(23, 59, 59);
    }

    const worker = workers.find(w => w.id === workerId);
    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      workerId,
      title: `${worker?.name} - ${shift === 'day' ? '주간' : '야간'}`,
      start: startDate,
      end: endDate,
      shift
    };

    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteWorker = (workerId) => {
    setWorkers(workers.filter(worker => worker.id !== workerId));
    setSchedules(schedules.filter(schedule => schedule.workerId !== workerId));
  };

  const handleDeleteSchedule = (scheduleId) => {
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
  };

  const calendarEvents = useMemo(() => {
    return schedules.map(schedule => ({
      ...schedule,
      resourceId: schedule.workerId,
      className: schedule.shift === 'day' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
    }));
  }, [schedules]);

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.shift === 'day' ? '#93C5FD' : '#C084FC',
      color: '#1E40AF',
      border: 'none',
      borderRadius: '4px'
    };
    return { style };
  };

  return (
    <div className="h-full w-full bg-gray-100 p-4">
      <div className="flex gap-4 h-full">
        {/* Worker Management Panel */}
        <div className="w-80 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4">
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
        </div>

        {/* Calendar Section */}
        <div className="flex-1 bg-white shadow-sm rounded-lg overflow-hidden" style={{ width: "1200px", fontSize: "14px" }}>
          <div className="h-full p-4">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100vh - 150px)' }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={(event) => handleDeleteSchedule(event.id)}
              views={['month', 'week', 'day']}
              defaultView="month"
              date={date}
              onNavigate={setDate}
              messages={{
                next: "다음",
                previous: "이전",
                today: "오늘",
                month: "월",
                week: "주",
                day: "일",
                agenda: "일정",
                noEventsInRange: "등록된 일정이 없습니다."
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleDisplay;
