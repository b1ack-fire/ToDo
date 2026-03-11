import React, { useState } from "react";
import CalendarScheduler from "./CalendarScheduler";
import HardcoreToDo from "./HardcoreToDo";
import SimpleToDo from "./SimpleToDo";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="home-container font-mono">
      <h1 className="title">My ToDo Dashboard</h1>
      <div className="mb-6 text-center space-y-2">
        <p>A simple yet powerful process to get us moving!</p>
        <p>
          In HardcoreToDo we choose deadlines for our tasks to stay on track.
        </p>
        <p>In SimpleToDo we can pick a date and time for a usual reminder.</p>
      </div>
      <p className="construct">UNDER CONSTRUCTION!</p>
    </div>
  );
};

export default Home;
