import { LOGIN, LOGOUT } from "../actionTypes.js";

const savedUser =
  typeof window !== "undefined" ? window.localStorage.getItem("recipe_user") : "";

const initialState = {
  isAuthenticated: Boolean(savedUser),
  user: savedUser ?? "",
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT:
      return {
        isAuthenticated: false,
        user: "",
      };
    default:
      return state;
  }
}
