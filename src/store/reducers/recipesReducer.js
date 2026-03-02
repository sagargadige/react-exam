import {
  ADD_RECIPE_SUCCESS,
  DELETE_RECIPE_SUCCESS,
  FETCH_RECIPES_FAILURE,
  FETCH_RECIPES_REQUEST,
  FETCH_RECIPES_SUCCESS,
  UPDATE_RECIPE_SUCCESS,
} from "../actionTypes.js";

function getInitialRecipes() {
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

const initialState = {
  items: getInitialRecipes(),
  loading: false,
  error: null,
};

export default function recipesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECIPES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload,
      };
    case FETCH_RECIPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_RECIPE_SUCCESS:
      return {
        ...state,
        error: null,
        items: [action.payload, ...state.items],
      };
    case UPDATE_RECIPE_SUCCESS:
      return {
        ...state,
        error: null,
        items: state.items.map((recipe) =>
          recipe.id === action.payload.id ? action.payload : recipe,
        ),
      };
    case DELETE_RECIPE_SUCCESS:
      return {
        ...state,
        error: null,
        items: state.items.filter((recipe) => recipe.id !== action.payload),
      };
    default:
      return state;
  }
}
