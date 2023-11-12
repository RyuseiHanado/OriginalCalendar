import React from "react";
import "./styles.css";
import MyCalendar from "./calendar/MyCalendar";

export default function App() {
  return (
    <div className="App">
      <h1>DnD Calendar</h1>
      <MyCalendar />
    </div>
  );
}
