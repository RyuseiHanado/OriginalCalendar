import * as React from "react";
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as ArrowLeftIcon } from "../images/ArrowLeftIcon.svg";
import { ReactComponent as ArrowRightIcon } from "../images/ArrowRightIcon.svg";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ColumnCalendar from "./ColumnCalendar";

const Button = styled.div`
  cursor: pointer;
`;

const NumderDay = styled.span`
  font-size: 12px;
  line-height: 28px;

  color: #373a44;
`;
const DayOfTheWeek = styled.span`
  font-size: 12px;
  line-height: 14px;

  color: #c7c8cd;
`;
const Day = styled.div`
  min-height: 330px;
  cursor: pointer;
  border-left: 1px dashed #e3eaee;
  border-right: 1px dashed #e3eaee;
  border-top: 1px solid #e3eaee;
  ${props =>
    props.isToday &&
    css`
      border: 1px solid #eee;
    `}
  ${props =>
    props.isSelected &&
    css`
      background-color: #eee;
      border-top: 3px solid #0d9cfc;
    `}
`;

const styles = theme => ({
  root: {
    width: "100%",
    minHeight: "43vh"
  },
  header: {
    fontSize: "14px",
    lineHeight: "19px",
    padding: "10px 10px 5px 10px",
    display: "flex",
    justifyContent: "center",
    color: "#373A44"
  },

  calendarBody: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    // flexWrap: 'inherit',
    overflowX: "scroll",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    "&::-webkit-scrollbar": {
      height: "6px"
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      background: "#A9C1D1",
      borderRadius: "10px"
    }
  },
  dayColumn: {
    width: "34px",
    display: "inline-block"
  }
});

function Calendar(props) {
  const { classes, setDaysOfMonth, dndState, resetStateColumns } = props;

  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const MONTHS = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
  ];

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  // const [startDay, setStartDay] = useState(getStartDayOfMonth(date));

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    // setStartDay(getStartDayOfMonth(date));
  }, [date]);
  useEffect(() => {
    handleDaysOfMonth(month);
  }, []);

  const handleDaysOfMonth = correctMonth =>
    Array(days[month])
      .fill(null)
      .map((_, index) => {
        const d = index + 1;
        const newDate = new Date(year, correctMonth, d);
        setDaysOfMonth(d, newDate);
      });

  const handleSlideMonth = correctMonth => {
    setDate(new Date(year, correctMonth, day));
    resetStateColumns();
    handleDaysOfMonth(correctMonth);
  };

  function getStartDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth()).getDay();
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days = isLeapYear(date.getFullYear()) ? DAYS_LEAP : DAYS;

  const dayOfTheWeek = d => {
    switch (new Date(year, month, d).getDay()) {
      case 0:
        return "Вс";
      case 1:
        return "Пн";
      case 2:
        return "Вт";
      case 3:
        return "Ср";
      case 4:
        return "Чт";
      case 5:
        return "Пт";
      default:
        return "Сб";
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Button onClick={() => handleSlideMonth(month - 1)}>
          <ArrowLeftIcon style={{ marginRight: "19px" }} />
        </Button>
        <div>
          {MONTHS[month]} {year}
        </div>
        <Button onClick={() => handleSlideMonth(month + 1)}>
          <ArrowRightIcon style={{ marginLeft: "19px" }} />
        </Button>
      </div>
      <div className={classes.calendarBody}>
        {/* {Array(days[month])
          .fill(null)
          .map((_, index) => {
            const d = index + 1;
            return (
              <ColumnCalendar
                d={d}
                day={day}
                month={month}
                year={year}
                dayOfTheWeek={dayOfTheWeek}
                today={today}
                setDate={setDate}
              />
            );
          })} */}
        {dndState.columnOrder.map((columnId, i, arr) => {
          const prevColumn = dndState.columns[arr[i - 1]];
          const prevTasks = prevColumn?.taskIds.map(
            taskId => dndState.tasks[taskId]
          );

          const nextColumn = dndState.columns[arr[i + 1]];
          const nextTasks = nextColumn?.taskIds.map(
            taskId => dndState.tasks[taskId]
          );

          const column = dndState.columns[columnId];
          const tasks = column.taskIds.map(taskId => dndState.tasks[taskId]);

          return (
            columnId !== "free-tasks" && (
              <ColumnCalendar
                prevTasks={prevTasks}
                nextTasks={nextTasks}
                tasks={tasks}
                key={column.id}
                column={column}
                d={column.title}
                day={day}
                month={month}
                year={year}
                dayOfTheWeek={dayOfTheWeek}
                today={today}
                setDate={setDate}
              />
            )
          );
        })}
      </div>
    </div>
  );
}

export default withStyles(styles)(Calendar);
