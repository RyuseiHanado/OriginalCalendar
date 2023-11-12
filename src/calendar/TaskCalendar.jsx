import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";
import clsx from "clsx";

import { ReactComponent as ArrowLeftIcon } from "../images/ArrowLeftIcon.svg";
import { ReactComponent as ArrowRightIcon } from "../images/ArrowRightIcon.svg";

const styles = theme => ({
  task: {
    position: "absolute",

    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "19px",
    color: "#FFFFFF",
    background: " #FFB946",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "3px 0",
    padding: " 0 3px",
    height: "26px"
    // minWidth: 'fit-content',
  },
  draggingTask: {
    opacity: "0.6",
    width: "inherit",
    color: "black"
  },
  resizeIcon: {
    cursor: "ew-resize",
    minWidth: "22px",
    height: "22px",
    background: "#A9C1D1",
    borderRadius: "25px",
    textAlign: "center",
    "& svg": {
      width: "5px",
      height: "9px",
      "& path": {
        fill: "#FFFFFF"
      }
    }
  }
});

class TaskCalendar extends React.Component {
  diffDates = (day_one, day_two) => {
    if (day_one !== day_two) {
      return (day_one - day_two) / (60 * 60 * 24 * 1000);
    } else {
      return day_one;
    }
  };

  render() {
    const { classes, task, index } = this.props;
    const widthDays = this.diffDates(new Date(task.end), new Date(task.start));
    const widthTask = widthDays * 34 + 26 + "px";
    const style = { width: widthTask };

    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <div
              key={task.id}
              task={task}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div
                style={style}
                className={clsx(
                  classes.task,
                  snapshot.isDragging && classes.draggingTask
                )}
              >
                <span className={classes.resizeIcon}>
                  <ArrowLeftIcon />
                </span>

                {task.content}

                <span className={classes.resizeIcon}>
                  <ArrowRightIcon />
                </span>
              </div>
            </div>
          );
        }}
      </Draggable>
    );
  }
}
export default withStyles(styles)(TaskCalendar);
