import authTypes from "./auth.types";

const {
  SIGN_USER_UP_START,
  SIGN_USER_UP_SUCCESS,
  SIGN_USER_UP_FAILURE,
  LOG_USER_IN_START,
  LOG_USER_IN_SUCCESS,
  LOG_USER_IN_FAILURE,
  LOG_USER_OUT_START,
  LOG_USER_OUT_SUCCESS,
  LOG_USER_OUT_FAILURE,
  FETCH_AUTH_OBJECT_START,
  FETCH_AUTH_OBJECT_SUCCESS,
  FETCH_AUTH_OBJECT_FAILURE,
} = authTypes;

const INITIAL_STATE = {
  userObject: null,
  isLoading: false,
  errorMessage: null,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_USER_UP_START:
    case LOG_USER_IN_START:
    case LOG_USER_OUT_START:
    case FETCH_AUTH_OBJECT_START:
      return { ...state, isLoading: true };
    case SIGN_USER_UP_SUCCESS:
    case LOG_USER_IN_SUCCESS:
    case FETCH_AUTH_OBJECT_SUCCESS:
      return { ...state, isLoading: false, userObject: action.payload };
    case LOG_USER_OUT_SUCCESS:
      return { ...state, isLoading: false, userObject: null };
    case SIGN_USER_UP_FAILURE:
    case LOG_USER_IN_FAILURE:
    case LOG_USER_OUT_FAILURE:
    case FETCH_AUTH_OBJECT_FAILURE:
      return { ...state, isLoading: false, errorMessage: action.payload };
    default:
      return state;
  }
};

export default authReducer;
