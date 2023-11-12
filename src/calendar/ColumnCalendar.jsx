import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import clsx from "clsx";
import { Grid } from "@material-ui/core";
import TaskCalendar from "./TaskCalendar";

const styles = theme => ({
  dropTaskList: {
    background: "#0D9CFC"
  },
  dayColumn: {
    minWidth: "34px",
    display: "inline-block",
    maxHeight: "360px"
  },
  numberDay: {
    fontSize: "12px",
    lineHeight: "28px",
    color: "#373A44"
  },
  weekDay: {
    fontSize: "12px",
    lineHeight: "14px",
    color: "#C7C8CD"
  },
  columnDay: {
    minHeight: "330px",
    maxHeight: "330px",
    cursor: "pointer",
    borderLeft: "1px dashed #E3EAEE",
    borderRight: "1px dashed #E3EAEE",
    borderTop: "3px solid #E3EAEE"
  },
  columnDayToday: {
    // border: '1px solid #eee',
    backgroundColor: " #eee"
  },
  columnDaySelected: {
    borderTop: "3px solid #0D9CFC"
  },
  dropTaskList: {
    background: "#0D9CFC"
  }
});

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.tasks === this.props.tasks) {
      return false;
    }
    return true;
  }

  render() {
    return this.props.tasks.map((task, i, arr) => {
      return <TaskCalendar key={task.id} task={task} index={i} />;
    });
  }
}

class ColumnCalendar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Droppable droppableId={this.props.column.id}>
        {(provided, snapshot) => (
          <Grid
            item
            container
            direction="column"
            className={classes.dayColumn}
            key={`calendarDay${this.props.d}`}
          >
            <Grid container justify="center">
              <span className={classes.numberDay}>{this.props.d}</span>
              <span className={classes.weekDay}>
                {this.props.dayOfTheWeek(this.props.d)}
              </span>
            </Grid>

            <div
              className={clsx(
                classes.columnDay,
                this.props.d === this.props.today.getDate().toString() &&
                  classes.columnDayToday,
                this.props.d === this.props.day.toString() &&
                  classes.columnDaySelected,
                snapshot.isDraggingOver && classes.dropTaskList
              )}
              key={this.props.d}
              onClick={e =>
                this.props.setDate(
                  new Date(this.props.year, this.props.month, this.props.d)
                )
              }
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <InnerList
                tasks={this.props.tasks}
                prevTasks={this.props.prevTasks}
                nextTasks={this.props.nextTasks}
              />
            </div>
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    );
  }
}
export default withStyles(styles)(ColumnCalendar);
