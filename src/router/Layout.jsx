import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import CalendarScheduler from "../MainPage/CalendarScheduler";

const Layout = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="app-container">
          {/* Calendar at the top */}
      <CalendarScheduler selectedDate={selectedDate} onSelect={setSelectedDate} />
      <nav className="nav-bar">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/hardcore"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav" : "nav-link"
          }
        >
          Hardcore Todo
        </NavLink>
        <NavLink
          to="/simple"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav" : "nav-link"
          }
        >
          Simple Todo
        </NavLink>
      </nav>

  

      {/* Render the current page and pass selectedDate as prop */}
      <Outlet context={{ selectedDate }} />
    </div>
  );
};

export default Layout;