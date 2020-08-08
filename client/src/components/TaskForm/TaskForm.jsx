import "./TaskForm.scss";
import React, { useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { addOneUserTask } from "../../redux/tasks/tasks.actions";

// components
import TextInput from "../TextInput/TextInput.jsx";
import Button from "../Button/Button.jsx";

const TaskForm = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const { title, description } = taskData;

  const onSubmit = (e) => {
    e.preventDefault();
    // testing and validation
    dispatch(addOneUserTask(taskData));
    // clean fields
    setTaskData({
      title: "",
      description: "",
    });
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  return (
    <div className="taskform">
      <form
        className="taskform__element"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextInput
          onChange={onInputChange}
          name="title"
          value={title}
          label="Title"
          type="text"
          id={"title-taskform"}
          required
        />
        <TextInput
          onChange={onInputChange}
          name="description"
          value={description}
          label="Description"
          type="text"
          id={"description-taskform"}
          required
        />
        <Button title="Create Task" active={isLoading ? 0 : 1} type="submit" />
      </form>
    </div>
  );
};

export default TaskForm;
