import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RecipeForm from "./components/RecipeForm.jsx";
import RecipeList from "./components/RecipeList.jsx";
import Login from "./components/Login.jsx";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/recipes"
            element={
              <PrivateRoute>
                <RecipeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/recipes" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={<p className="text-muted mb-0">Page not found.</p>}
          />
        </Routes>
      </main>
      <ToastContainer autoClose={2500} newestOnTop position="top-right" />
    </>
  );
}

export default App;
