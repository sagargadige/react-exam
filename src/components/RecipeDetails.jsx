import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteRecipe,
  updateRecipe,
} from "../store/actions/recipeActions.js";

function RecipeDetails({ recipe }) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    title: recipe.title ?? "",
    ingredients: recipe.ingredients ?? "",
    category: recipe.category ?? "",
    dietary: recipe.dietary ?? "",
    instructions: recipe.instructions ?? "",
  });
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async () => {
    if (!formValues.title.trim() || !formValues.ingredients.trim()) {
      setError("Title and ingredients are required.");
      return;
    }

    setError("");
    const updated = await dispatch(
      updateRecipe(recipe.id, {
        ...recipe,
        ...formValues,
        title: formValues.title.trim(),
        ingredients: formValues.ingredients.trim(),
        instructions: formValues.instructions.trim(),
      }),
    );

    if (updated) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteRecipe(recipe.id));
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              className="form-control form-control-sm mb-2"
              name="title"
              value={formValues.title}
              onChange={handleChange}
            />
            <textarea
              className="form-control form-control-sm mb-2"
              rows="2"
              name="ingredients"
              value={formValues.ingredients}
              onChange={handleChange}
            />
            <input
              className="form-control form-control-sm mb-2"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <input
              className="form-control form-control-sm mb-2"
              name="dietary"
              value={formValues.dietary}
              onChange={handleChange}
              placeholder="Dietary"
            />
            <textarea
              className="form-control form-control-sm mb-2"
              rows="3"
              name="instructions"
              value={formValues.instructions}
              onChange={handleChange}
              placeholder="Instructions"
            />
            {error ? (
              <div className="alert alert-danger py-1 small mb-2">{error}</div>
            ) : null}
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSave}
                type="button"
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setError("");
                  setFormValues({
                    title: recipe.title ?? "",
                    ingredients: recipe.ingredients ?? "",
                    category: recipe.category ?? "",
                    dietary: recipe.dietary ?? "",
                    instructions: recipe.instructions ?? "",
                  });
                  setIsEditing(false);
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="h6 mb-2">{recipe.title}</h2>
            <p className="mb-2 small">
              <strong>Ingredients:</strong> {recipe.ingredients}
            </p>
            <p className="mb-1 small">
              <strong>Category:</strong> {recipe.category || "N/A"}
            </p>
            <p className="mb-1 small">
              <strong>Dietary:</strong> {recipe.dietary || "N/A"}
            </p>
            <p className="mb-3 small">
              <strong>Instructions:</strong> {recipe.instructions || "N/A"}
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;
