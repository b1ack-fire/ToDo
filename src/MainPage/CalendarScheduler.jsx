import React, { useState } from "react";
import "./Calendar.css";

const CalendarScheduler = ({ selectedDate, onSelect }) => {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };
  const goToday = () => {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  const isToday = (day) =>
    day === now.getDate() &&
    currentMonth === now.getMonth() &&
    currentYear === now.getFullYear();

  // FIX: compare year + month + day, not just day
  const isSelected = (day) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  const calendarDays = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleSelect = (day) => {
    if (!day) return;
    onSelect(new Date(currentYear, currentMonth, day));
  };

  return (
    <div className="calendar-box">
      <div className="cal-header">
        <div className="cal-nav">
          <button onClick={prevMonth} className="cal-btn">‹</button>
          <button onClick={goToday}   className="cal-btn">Today</button>
          <button onClick={nextMonth} className="cal-btn">›</button>
        </div>
        <h2 className="cal-month-label">{monthNames[currentMonth]} {currentYear}</h2>
      </div>

      <div className="cal-grid">
        {daysOfWeek.map((d) => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(day)}
            className={[
              "cal-day",
              !day           ? "cal-day--empty"    : "",
              isToday(day)   ? "cal-day--today"    : "",
              isSelected(day)? "cal-day--selected" : "",
            ].join(" ")}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarScheduler;