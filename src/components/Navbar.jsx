import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../store/actions/authActions.js";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const username = useSelector((state) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md bg-light border-bottom">
      <div className="container">
        <NavLink className="navbar-brand fw-semibold" to="/">
          Recipe Book
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/recipes">
              Recipes
            </NavLink>
            <NavLink className="nav-link" to="/add">
              Add Recipe
            </NavLink>
          </div>

          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            {isAuthenticated ? (
              <>
                <small className="text-muted">{username}</small>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleLogout}
                  type="button"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink className="btn btn-primary btn-sm" to="/login">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
