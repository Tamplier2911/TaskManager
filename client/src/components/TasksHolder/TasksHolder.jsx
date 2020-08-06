import "./TasksHolder.scss";
import React from "react";

// components
import Task from "../Task/Task.jsx";

const TasksHolder = () => {
  const tasks = [
    {
      isCompleted: false,
      createdAt: "2020-07-29T15:52:09.197Z",
      _id: "5f219b4f2f06ae1c4c6316fcx",
      title: "This is my first task.",
      description: "I'll try to finish this as soon as possible.",
    },
    {
      isCompleted: true,
      createdAt: "2020-07-29T15:52:09.197Z",
      _id: "5f219b4f2f06ae1c4c6316fcz",
      title: "This is my first task.",
      description: "I'll try to finish this as soon as possible.",
    },
    {
      isCompleted: true,
      createdAt: "2020-07-29T15:52:09.197Z",
      _id: "5f219b4f2f06ae1c4c6316fct",
      title: "This is my first task.",
      description:
        "I'll try to finish this as soon as possible. I'll try to finish this as soon as possible.",
    },
  ];
  return (
    <div className="tasksholder">
      {tasks.length ? (
        <div className="tasksholder__tasks">
          {tasks.map((obj) => {
            return <Task {...obj} key={obj._id} />;
          })}
        </div>
      ) : (
        <div className="tasksholder__empty">
          You don't have created tasks yet.
        </div>
      )}
    </div>
  );
};

export default TasksHolder;
