import { combineReducers } from "redux";

// reducers
import authReducer from "./auth/auth.reducer";
import tasksReducer from "./tasks/tasks.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
});

export default rootReducer;
