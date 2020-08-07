import "./Task.scss";
import React from "react";

// redux
// redux
import { useDispatch } from "react-redux";
import {
  markTaskCompleted,
  markTaskIncompleted,
  deleteOneUserTask,
} from "../../redux/tasks/tasks.actions";

// svgs
import TrashCanSVG from "../../assets/svg/trash.svg";
import CheckedSVG from "../../assets/svg/tick.svg";
import CircleSVG from "../../assets/svg/circle.svg";

const Task = ({ _id, title, description, createdAt, isCompleted }) => {
  const dispatch = useDispatch();
  return (
    <div className="task">
      <div
        className="task__left"
        onClick={() => dispatch(deleteOneUserTask(_id))}
      >
        <TrashCanSVG className="task__left--svg" />
      </div>
      <div className="task__mid">
        <div
          className={`task__mid--title ${
            isCompleted ? "task__mid--completed" : ""
          }`}
        >
          {title}
        </div>
        <div
          className={`task__mid--desc ${
            isCompleted ? "task__mid--completed" : ""
          }`}
        >
          {description}
        </div>
        <div
          className={`task__mid--created ${
            isCompleted ? "task__mid--completed" : ""
          }`}
        >
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>
      <div
        className="task__right"
        onClick={() =>
          isCompleted
            ? dispatch(markTaskIncompleted(_id))
            : dispatch(markTaskCompleted(_id))
        }
      >
        {isCompleted ? (
          <CheckedSVG className="task__right--svg" />
        ) : (
          <CircleSVG className="task__right--svg" />
        )}
      </div>
    </div>
  );
};

export default Task;
