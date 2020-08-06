import "./Task.scss";
import React from "react";

// svgs
import TrashCanSVG from "../../assets/svg/trash.svg";
import CheckedSVG from "../../assets/svg/tick.svg";
import CircleSVG from "../../assets/svg/circle.svg";

const Task = ({ _id, title, description, createdAt, isCompleted }) => {
  return (
    <div className="task" key={_id}>
      <div className="task__left">
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
      <div className="task__right">
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
