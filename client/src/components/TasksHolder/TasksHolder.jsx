import "./TasksHolder.scss";
import React, { useEffect } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getAllUserTasks } from "../../redux/tasks/tasks.actions";

// components
import TaskForm from "../TaskForm/TaskForm.jsx";
import Task from "../Task/Task.jsx";
import Spinner from "../Spinner/Spinner.jsx";

const TasksHolder = () => {
  const { allTasks, isLoading } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUserTasks());
  }, []);

  return (
    <div className="tasksholder">
      <div className="tasksholder__create">
        <TaskForm />
      </div>
      {isLoading ? (
        <Spinner />
      ) : allTasks.length ? (
        <div className="tasksholder__tasks">
          {allTasks.map((obj) => {
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
