import { LOGIN, LOGOUT } from "../actionTypes.js";

export function login(username) {
  return {
    type: LOGIN,
    payload: username,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
