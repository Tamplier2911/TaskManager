import axios from "axios";
import { cleanTasksFromState } from "../tasks/tasks.actions";
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

export const signUserUpStart = () => ({
  type: SIGN_USER_UP_START,
});

export const signUserUpSuccess = (userObject) => ({
  type: SIGN_USER_UP_SUCCESS,
  payload: userObject,
});

export const signUserUpFailure = (errorMessage) => ({
  type: SIGN_USER_UP_FAILURE,
  payload: errorMessage,
});

export const logUserInStart = () => ({
  type: LOG_USER_IN_START,
});

export const logUserInSuccess = (userObject) => ({
  type: LOG_USER_IN_SUCCESS,
  payload: userObject,
});

export const logUserInFailure = (errorMessage) => ({
  type: LOG_USER_IN_FAILURE,
  payload: errorMessage,
});

export const logUserOutStart = () => ({
  type: LOG_USER_OUT_START,
});

export const logUserOutSuccess = () => ({
  type: LOG_USER_OUT_SUCCESS,
});

export const logUserOutFailure = (errorMessage) => ({
  type: LOG_USER_OUT_FAILURE,
  payload: errorMessage,
});

export const fetchAuthObjectStart = () => ({
  type: FETCH_AUTH_OBJECT_START,
});

export const fetchAuthObjectSuccess = (userObject) => ({
  type: FETCH_AUTH_OBJECT_SUCCESS,
  payload: userObject,
});

export const fetchAuthObjectFailure = (errorMessage) => ({
  type: FETCH_AUTH_OBJECT_FAILURE,
  payload: errorMessage,
});

export const signUpUserWithEmailAndPassword = (userCredentials) => async (
  dispatch
) => {
  try {
    // trigger loader
    dispatch(signUserUpStart());

    // sign user up
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: { ...userCredentials },
    });

    // sign user up
    dispatch(signUserUpSuccess(res.data.data));
  } catch (err) {
    // catch error
    dispatch(signUserUpFailure(err.message));
  }
};

export const logUserInWithEmailAndPassword = (userCredentials) => async (
  dispatch
) => {
  try {
    // trigger loader
    dispatch(logUserInStart());

    // log user in
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: { ...userCredentials },
    });

    // save auth object
    dispatch(logUserInSuccess(res.data.data));
  } catch (err) {
    // catch error
    dispatch(logUserInFailure(err.message));
  }
};

export const logUserOutAndCleanState = () => async (dispatch) => {
  try {
    // trigger loader
    dispatch(logUserOutStart());

    // log user out
    await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    // clean up state
    dispatch(logUserOutSuccess(null));

    // clean up tasks state
    dispatch(cleanTasksFromState());
  } catch (err) {
    // catch error
    dispatch(logUserOutFailure());
  }
};

export const fetchUserObjectFromApi = () => async (dispatch) => {
  try {
    // trigger loader
    dispatch(fetchAuthObjectStart());

    // fetch auth object
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/getMe",
    });

    // store user object in sate
    dispatch(fetchAuthObjectSuccess(res.data.data.userObject));
  } catch (err) {
    // catch error
    dispatch(fetchAuthObjectFailure(err.message));
  }
};
