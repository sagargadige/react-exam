import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addRecipe } from "../store/actions/recipeActions.js";

const defaultValues = {
  title: "",
  ingredients: "",
  category: "",
  dietary: "",
  instructions: "",
};

function RecipeForm() {
  const [formValues, setFormValues] = useState(defaultValues);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.recipes.loading);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.title.trim() || !formValues.ingredients.trim()) {
      const message = "Title and ingredients are required.";
      setError(message);
      toast.error(message);
      return;
    }

    setError("");
    const added = await dispatch(
      addRecipe({
        ...formValues,
        title: formValues.title.trim(),
        ingredients: formValues.ingredients.trim(),
        instructions: formValues.instructions.trim(),
      }),
    );

    if (added) {
      setFormValues(defaultValues);
      toast.success("Recipe added successfully.");
      navigate("/recipes");
    } else {
      toast.error("Unable to add recipe. Please try again.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h4 mb-3">Add Recipe</h1>
        <form className="card card-body" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="form-control mb-3"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Recipe title"
          />

          <label className="form-label" htmlFor="ingredients">
            Ingredients
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            className="form-control mb-3"
            rows="3"
            value={formValues.ingredients}
            onChange={handleChange}
            placeholder="Comma separated ingredients"
          />

          <div className="row">
            <div className="col-md-6">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                name="category"
                className="form-control mb-3"
                value={formValues.category}
                onChange={handleChange}
                placeholder="Breakfast, Lunch, Dinner"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="dietary">
                Dietary
              </label>
              <input
                id="dietary"
                name="dietary"
                className="form-control mb-3"
                value={formValues.dietary}
                onChange={handleChange}
                placeholder="Vegetarian, Vegan, etc."
              />
            </div>
          </div>

          <label className="form-label" htmlFor="instructions">
            Instructions
          </label>
          <textarea
            id="instructions"
            name="instructions"
            className="form-control mb-3"
            rows="4"
            value={formValues.instructions}
            onChange={handleChange}
            placeholder="Short instructions"
          />

          {error ? <div className="alert alert-danger py-2">{error}</div> : null}
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "Saving..." : "Add Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
