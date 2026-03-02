import {
  ADD_RECIPE_SUCCESS,
  DELETE_RECIPE_SUCCESS,
  FETCH_RECIPES_FAILURE,
  FETCH_RECIPES_REQUEST,
  FETCH_RECIPES_SUCCESS,
  UPDATE_RECIPE_SUCCESS,
} from "../actionTypes.js";
import { RECIPES_API_URL } from "../api.js";
import fallbackRecipes from "../fallbackRecipes.js";

function readCachedRecipes() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem("recipe_cache");

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function parseResponse(response) {
  if (!response.ok) {
    let message = "Request failed.";

    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      message = `Request failed with status ${response.status}.`;
    }

    throw new Error(message);
  }

  return response.json();
}

export function fetchRecipes() {
  return async (dispatch) => {
    dispatch({ type: FETCH_RECIPES_REQUEST });

    try {
      const response = await fetch(RECIPES_API_URL);
      const recipes = await parseResponse(response);

      dispatch({
        type: FETCH_RECIPES_SUCCESS,
        payload: recipes,
      });
    } catch {
      const cachedRecipes = readCachedRecipes();

      if (cachedRecipes.length > 0) {
        dispatch({
          type: FETCH_RECIPES_SUCCESS,
          payload: cachedRecipes,
        });
        return;
      }

      dispatch({
        type: FETCH_RECIPES_SUCCESS,
        payload: fallbackRecipes,
      });
    }
  };
}

export function addRecipe(recipe) {
  return async (dispatch) => {
    try {
      const response = await fetch(RECIPES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recipe,
          dateAdded: recipe.dateAdded ?? new Date().toISOString(),
        }),
      });

      const createdRecipe = await parseResponse(response);
      dispatch({
        type: ADD_RECIPE_SUCCESS,
        payload: createdRecipe,
      });
      return true;
    } catch {
      const localRecipe = {
        id: Date.now(),
        ...recipe,
        dateAdded: recipe.dateAdded ?? new Date().toISOString(),
        isLocalOnly: true,
      };

      dispatch({
        type: ADD_RECIPE_SUCCESS,
        payload: localRecipe,
      });
      return true;
    }
  };
}

export function updateRecipe(id, recipe) {
  return async (dispatch) => {
    try {
      const response = await fetch(`${RECIPES_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      const updatedRecipe = await parseResponse(response);
      dispatch({
        type: UPDATE_RECIPE_SUCCESS,
        payload: updatedRecipe,
      });
      return true;
    } catch {
      dispatch({
        type: UPDATE_RECIPE_SUCCESS,
        payload: {
          ...recipe,
          id,
          isLocalOnly: true,
        },
      });
      return true;
    }
  };
}

export function deleteRecipe(id) {
  return async (dispatch) => {
    try {
      const response = await fetch(`${RECIPES_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}.`);
      }

      dispatch({
        type: DELETE_RECIPE_SUCCESS,
        payload: id,
      });
      return true;
    } catch {
      dispatch({
        type: DELETE_RECIPE_SUCCESS,
        payload: id,
      });
      return true;
    }
  };
}
