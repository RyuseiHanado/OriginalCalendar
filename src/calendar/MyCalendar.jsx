import React, { Component, useState } from "react";
import { connect, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Calendar from "./Calendar";
import { withStyles } from "@material-ui/core/styles";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";
import Column from "./Column";

const styles = theme => ({});

class MyCalendar extends React.Component {
  state = {
    tasks: {
      "tasc-1": {
        id: "tasc-1",
        content: "tasc-1",
        start: "Sat Aug 01 2020 00:00:00 GMT+0300 (Moscow Standard Time)",
        end: "Fri Aug 7 2020 00:00:00 GMT+0300 (Moscow Standard Time)"
      },
      "tasc-2": { id: "tasc-2", content: "tasc-2", start: null, end: null },
      "tasc-3": {
        id: "tasc-3",
        content: "tasc-3",
        start: null,
        end: "Thu Sep 24 2020 00:00:00 GMT+0300 "
      },
      "tasc-4": { id: "tasc-4", content: "tasc-4", start: null, end: null }
    },
    columns: {
      "free-tasks": {
        id: "free-tasks",
        title: "Свободные задачи",
        taskIds: ["tasc-1", "tasc-2", "tasc-3", "tasc-4"]
      }
    },
    columnOrder: ["free-tasks"]
  };
  // добавляет в стэйт колонны дней месяца
  setDaysOfMonth = (d, newDate) => {
    // добавляет таски в календарь , если start не null
    let taskIds = [];
    for (let key in this.state.tasks) {
      this.state.tasks[key].start == newDate &&
        taskIds.push(key) &&
        this.state.columns["free-tasks"].taskIds.splice(key, 1);
    }
    // формируем колонны дней месяца
    const newColumn = {
      [`${newDate}`]: {
        id: `${newDate}`,
        title: `${d}`,
        taskIds: taskIds
      }
    };
    console.log(newColumn);
    this.setState(state => ({
      columnOrder: [...state.columnOrder, `${newDate}`]
    }));
    this.setState(state => ({ columns: { ...state.columns, ...newColumn } }));
  };
  // сбрасывает стэйт при переключении месяцев
  resetStateColumns = () => {
    this.setState(state => ({ columnOrder: ["free-tasks"] }));
    this.setState(state => ({
      columns: { "free-tasks": { ...this.state.columns["free-tasks"] } }
    }));
  };

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    // moving tasks in the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      return this.setState(newState);
    } else if (start.id === "free-tasks") {
      // moving from 'free-tasks' to calendar
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      const newState = {
        ...this.state,
        // putting statr date task at droppable column
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        },
        //adding start & end to mooving task
        tasks: {
          ...this.state.tasks,
          [draggableId]: {
            ...this.state.tasks[draggableId],
            start: finish.id
            // end: 'Thu Jul 19 2020 00:00:00 GMT+0300 (Moscow Standard Time)'
          }
        }
      };
      return this.setState(newState);
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      !finishTaskIds.includes(draggableId) &&
        finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        },
        //adding end to mooving task
        tasks: {
          ...this.state.tasks,
          [draggableId]: {
            ...this.state.tasks[draggableId],
            start: finish.id
            // end: finish.id
          }
        }
      };
      return this.setState(newState);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div
        className="Calendar"
        style={{
          flexGrow: 1,
          fontFamily: "Lato",
          fontStyle: "normal",
          fontWeight: "normal"
        }}
      >
        <Grid container>
          <DragDropContext
            onDragStart={this.onDragStart}
            onDragUpdate={this.onDragUpdate}
            onDragEnd={this.onDragEnd}
          >
            <Grid
              item
              container
              alignItems="flex-start"
              style={{ width: "20%" }}
            >
              {this.state.columnOrder.map(columnId => {
                const column = this.state.columns[columnId];
                const tasks = column.taskIds.map(
                  taskId => this.state.tasks[taskId]
                );
                return (
                  columnId === "free-tasks" && (
                    <Column key={column.id} column={column} tasks={tasks} />
                  )
                );
              })}
            </Grid>

            <Grid item style={{ width: "80%" }}>
              <Calendar
                setDaysOfMonth={this.setDaysOfMonth.bind(this)}
                dndState={this.state}
                resetStateColumns={this.resetStateColumns}
              />
            </Grid>
          </DragDropContext>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(MyCalendar);
