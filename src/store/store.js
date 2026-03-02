import { applyMiddleware, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers/index.js";

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const { auth, recipes } = store.getState();

    if (auth.isAuthenticated && auth.user) {
      window.localStorage.setItem("recipe_user", auth.user);
    } else {
      window.localStorage.removeItem("recipe_user");
    }

    window.localStorage.setItem("recipe_cache", JSON.stringify(recipes.items));
  });
}

export default store;
