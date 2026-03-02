import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import recipesReducer from "./recipesReducer.js";

const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipesReducer,
});

export default rootReducer;
