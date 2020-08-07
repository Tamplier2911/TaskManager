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

const INITIAL_STATE = {
  allTasks: [],
  isLoading: false,
  errorMessage: "",
};

const tasksReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_TASKS_START:
    case ADD_USER_TASK_START:
      return { ...state, isLoading: true };
    case GET_USER_TASKS_SUCCESS:
      return { ...state, isLoading: false, allTasks: action.payload };
    case ADD_USER_TASK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allTasks: [action.payload, ...state.allTasks],
      };
    case UPDATE_USER_TASK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allTasks: state.allTasks.map((obj) => {
          if (obj._id === action.payload._id) {
            obj.isCompleted = action.payload.isCompleted;
            return obj;
          } else return obj;
        }),
      };
    case DELETE_USER_TASK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allTasks: state.allTasks.filter((obj) => obj._id !== action.payload),
      };
    case GET_USER_TASKS_FAILURE:
    case ADD_USER_TASK_FAILURE:
    case UPDATE_USER_TASK_FAILURE:
    case DELETE_USER_TASK_FAILURE:
      return { ...state, isLoading: false, errorMessage: action.payload };
    case CLEAN_TASKS_FROM_STATE:
      return { ...state, isLoading: false, allTasks: [], errorMessage: "" };
    default:
      return state;
  }
};

export default tasksReducer;
