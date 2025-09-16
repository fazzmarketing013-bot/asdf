
import React, { useState } from 'react';
import type { Member } from '../types';

interface GroceryCalendarProps {
  members: Member[];
  calendarData: { [date: string]: string };
  setCalendarData: React.Dispatch<React.SetStateAction<{ [date: string]: string }>>;
}

const GroceryCalendar: React.FC<GroceryCalendarProps> = ({ members, calendarData, setCalendarData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const calendarDays = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    calendarDays.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const handleDateSelect = (date: string, memberName: string) => {
    setCalendarData(prev => {
        const newData = {...prev};
        if (memberName === "") {
            delete newData[date];
        } else {
            newData[date] = memberName;
        }
        return newData;
    });
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <i className="fa-solid fa-calendar-days mr-3 text-primary-500"></i> Grocery Calendar
      </h2>
      
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysOfWeek.map(d => (
          <div key={d} className="font-medium text-gray-500 dark:text-gray-400 p-2">{d}</div>
        ))}

        {calendarDays.map((date, index) => {
          const dateString = date.toISOString().slice(0, 10);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = new Date().toISOString().slice(0, 10) === dateString;
          const shopperName = calendarData[dateString];

          return (
            <div 
              key={index} 
              className={`border rounded-lg p-1 min-h-[100px] flex flex-col justify-between transition-colors ${
                isCurrentMonth ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-700/50'
              }`}
            >
              <div className={`font-semibold ${
                isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'
              } ${isToday ? 'bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
                {date.getDate()}
              </div>
              <div className="flex-grow flex items-center justify-center text-center">
                {shopperName && (
                  <span className="font-bold text-lg text-primary-600 dark:text-primary-400 break-words">
                    {shopperName}
                  </span>
                )}
              </div>
              {isCurrentMonth && (
                <select 
                  value={shopperName || ""}
                  onChange={(e) => handleDateSelect(dateString, e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mt-1"
                >
                  <option value="">-</option>
                  {members.filter(m => m.name).map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroceryCalendar;
