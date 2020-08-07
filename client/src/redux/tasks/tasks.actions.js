import axios from "axios";
import tasksTypes from "./tasks.types";

const {
  GET_USER_TASKS_START,
  GET_USER_TASKS_SUCCESS,
  GET_USER_TASKS_FAILURE,
  ADD_USER_TASK_START,
  ADD_USER_TASK_SUCCESS,
  ADD_USER_TASK_FAILURE,
  UPDATE_USER_TASK_START,
  UPDATE_USER_TASK_SUCCESS,
  UPDATE_USER_TASK_FAILURE,
  DELETE_USER_TASK_START,
  DELETE_USER_TASK_SUCCESS,
  DELETE_USER_TASK_FAILURE,
  CLEAN_TASKS_FROM_STATE,
} = tasksTypes;

export const getUserTasksStart = () => ({
  type: GET_USER_TASKS_START,
});

export const getUserTasksSuccess = (userTasks) => ({
  type: GET_USER_TASKS_SUCCESS,
  payload: userTasks,
});

export const getUserTasksFailure = (errorMessage) => ({
  type: GET_USER_TASKS_FAILURE,
  payload: errorMessage,
});

export const addUserTaskStart = () => ({
  type: ADD_USER_TASK_START,
});

export const addUserTaskSuccess = (createdTask) => ({
  type: ADD_USER_TASK_SUCCESS,
  payload: createdTask,
});

export const addUserTaskFailure = (errorMessage) => ({
  type: ADD_USER_TASK_FAILURE,
  payload: errorMessage,
});

export const updateUserTaskStart = () => ({
  type: UPDATE_USER_TASK_START,
});

export const updateUserTaskSuccess = (updatedTask) => ({
  type: UPDATE_USER_TASK_SUCCESS,
  payload: updatedTask,
});

export const updateUserTaskFailure = (errorMessage) => ({
  type: UPDATE_USER_TASK_FAILURE,
  payload: errorMessage,
});

export const deleteUserTaskStart = () => ({
  type: DELETE_USER_TASK_START,
});

export const deleteUserTaskSuccess = (deletedTaskId) => ({
  type: DELETE_USER_TASK_SUCCESS,
  payload: deletedTaskId,
});

export const deleteUserTaskFailure = (errorMessage) => ({
  type: DELETE_USER_TASK_FAILURE,
  payload: errorMessage,
});

export const cleanTasksFromState = () => ({
  type: CLEAN_TASKS_FROM_STATE,
});

export const getAllUserTasks = () => async (dispatch) => {
  try {
    // spin loader
    dispatch(getUserTasksStart());

    // fetch user tasks
    const res = await axios({
      method: "GET",
      url: "/api/v1/tasks/userTask",
    });

    // store user tasks in state
    dispatch(getUserTasksSuccess(res.data.data));
  } catch (err) {
    // catch error
    dispatch(getUserTasksFailure(err.message));
  }
};

export const addOneUserTask = (taskData) => async (dispatch) => {
  try {
    // spin loader
    dispatch(addUserTaskStart());

    // add user task
    const res = await axios({
      method: "POST",
      url: "/api/v1/tasks/userTask",
      data: taskData,
    });

    // add task to state
    dispatch(addUserTaskSuccess(res.data.data));
  } catch (err) {
    dispatch(addUserTaskFailure(err.message));
  }
};

export const markTaskCompleted = (taskId) => async (dispatch) => {
  try {
    // spin loader
    dispatch(updateUserTaskStart());

    // update user task
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/tasks/userTask/${taskId}`,
      data: {
        isCompleted: true,
      },
    });

    // update state
    dispatch(updateUserTaskSuccess(res.data.data));
  } catch (err) {
    dispatch(updateUserTaskFailure(err.message));
  }
};

export const markTaskIncompleted = (taskId) => async (dispatch) => {
  try {
    // spin loader
    dispatch(updateUserTaskStart());

    // update user task
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/tasks/userTask/${taskId}`,
      data: {
        isCompleted: false,
      },
    });

    // update state
    dispatch(updateUserTaskSuccess(res.data.data));
  } catch (err) {
    dispatch(updateUserTaskFailure(err.message));
  }
};

export const deleteOneUserTask = (taskId) => async (dispatch) => {
  try {
    // spin loader
    dispatch(deleteUserTaskStart());

    // update user task
    await axios({
      method: "DELETE",
      url: `/api/v1/tasks/userTask/${taskId}`,
    });

    // update state
    dispatch(deleteUserTaskSuccess(taskId));
  } catch (err) {
    dispatch(deleteUserTaskFailure(err.message));
  }
};
