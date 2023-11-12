import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";
import clsx from "clsx";

const styles = theme => ({
  task: {
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "19px",
    color: "#FFFFFF",
    background: "#668BA3",
    borderRadius: "20px",
    margin: "3px",
    padding: " 0 10px"
  },
  draggingTask: {
    opacity: "0.6"
  }
});

class Task extends React.Component {
  render() {
    const { classes, task, index } = this.props;

    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <div
            className={clsx(
              classes.task,
              snapshot.isDragging && classes.draggingTask
            )}
            key={task.id}
            task={task}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
          </div>
        )}
      </Draggable>
    );
  }
}
export default withStyles(styles)(Task);
