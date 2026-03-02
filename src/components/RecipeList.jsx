import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchRecipes } from "../store/actions/recipeActions.js";
import RecipeDetails from "./RecipeDetails.jsx";

function RecipeList() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.items);
  const loading = useSelector((state) => state.recipes.loading);
  const error = useSelector((state) => state.recipes.error);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: `recipes-error-${error}` });
    }
  }, [error]);

  const categoryOptions = useMemo(
    () =>
      [...new Set(recipes.map((recipe) => recipe.category).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [recipes],
  );

  const visibleRecipes = useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      return categoryFilter === "all" || recipe.category === categoryFilter;
    });

    return [...filtered].sort((first, second) => {
      const categoryOrder = String(first.category ?? "").localeCompare(
        String(second.category ?? ""),
      );

      if (categoryOrder !== 0) {
        return categoryOrder;
      }

      return String(first.title ?? "").localeCompare(String(second.title ?? ""));
    });
  }, [recipes, categoryFilter]);

  return (
    <section>
      <h1 className="h4 mb-3">Recipe List</h1>

      <div className="card card-body mb-3">
        <div className="row g-2">
          <div className="col-sm-12">
            <label className="form-label small mb-1">Category</label>
            <select
              className="form-select"
              onChange={(event) => setCategoryFilter(event.target.value)}
              value={categoryFilter}
            >
              <option value="all">All</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? <p className="text-muted">Loading recipes...</p> : null}
      {error ? <div className="alert alert-danger py-2">{error}</div> : null}

      {!loading && !error && visibleRecipes.length === 0 ? (
        <p className="text-muted mb-0">No recipes match the selected filters.</p>
      ) : null}

      <div className="row g-3">
        {visibleRecipes.map((recipe) => (
          <div className="col-12 col-md-6 col-lg-4" key={recipe.id}>
            <RecipeDetails recipe={recipe} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecipeList;
