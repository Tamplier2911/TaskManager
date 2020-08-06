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

export const deleteUserTaskSuccess = (deletedTask) => ({
  type: DELETE_USER_TASK_SUCCESS,
  payload: deletedTask,
});

export const deleteUserTaskFailure = (errorMessage) => ({
  type: DELETE_USER_TASK_FAILURE,
  payload: errorMessage,
});
