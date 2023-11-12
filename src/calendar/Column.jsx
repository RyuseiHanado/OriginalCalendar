import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import clsx from "clsx";

const styles = theme => ({
  taskList: {
    transition: "background-color 0.2s ease",
    border: "1px solid grey",
    width: "100%",
    display: "contents",
    minHeight: "100px",
    flexGrow: "1"
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
    return this.props.tasks.map((task, i, arr) => (
      <Task key={task.id} task={task} index={i} />
    ));
  }
}

class Column extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          flexWrap: "wrap",
          background: "#FFFFFF"
        }}
      >
        <div style={{ color: "gray", textAlign: "center", width: "100%" }}>
          {this.props.column.title}
        </div>

        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <div
              className={clsx(
                classes.taskList,
                snapshot.isDraggingOver && classes.dropTaskList
              )}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <InnerList tasks={this.props.tasks} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}
export default withStyles(styles)(Column);
