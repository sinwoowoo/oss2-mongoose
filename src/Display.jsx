import React, { useState } from 'react';
import { Calendar } from './components/ui/calendar';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';

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

  const handleDeleteSchedule = (workerId, date) => {
    setSchedules(schedules.filter(schedule => 
      !(schedule.workerId === workerId && 
        schedule.date.toDateString() === date.toDateString())
    ));
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex space-x-4">
        <Card className="w-1/2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">근무자 관리</h2>
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="이름"
                value={newWorker.name}
                onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
              />
              <Input
                placeholder="직책"
                value={newWorker.position}
                onChange={(e) => setNewWorker({...newWorker, position: e.target.value})}
              />
              <Button 
                onClick={handleAddWorker}
                className="w-full"
              >
                근무자 추가
              </Button>
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
                      <Button 
                        onClick={() => handleAddSchedule(worker.id, 'day')}
                        variant="outline"
                        size="sm"
                      >
                        주간
                      </Button>
                      <Button 
                        onClick={() => handleAddSchedule(worker.id, 'night')}
                        variant="outline"
                        size="sm"
                      >
                        야간
                      </Button>
                      <Button 
                        onClick={() => handleDeleteWorker(worker.id)}
                        variant="destructive"
                        size="sm"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">근무 일정</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
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
                    <Button 
                      onClick={() => handleDeleteSchedule(schedule.workerId, schedule.date)}
                      variant="destructive"
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkScheduleDisplay;
