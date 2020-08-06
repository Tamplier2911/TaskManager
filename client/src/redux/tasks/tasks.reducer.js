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

const INITIAL_STATE = {
  allTasks: [],
  isLoading: false,
  errorMessage: "",
};

const tasksReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default tasksReducer;
