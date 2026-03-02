import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../store/actions/authActions.js";

const ACCOUNTS_KEY = "recipe_accounts";

function getSavedAccounts() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ACCOUNTS_KEY);

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

function Login() {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      const message = "Username and password are required.";
      setError(message);
      toast.error(message);
      return;
    }

    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();
    const savedAccounts = getSavedAccounts();

    if (isSignupMode) {
      if (normalizedPassword !== confirmPassword.trim()) {
        const message = "Password and confirm password must match.";
        setError(message);
        toast.error(message);
        return;
      }

      const userExists = savedAccounts.some(
        (account) =>
          String(account.username).toLowerCase() === normalizedUsername.toLowerCase(),
      );

      if (userExists) {
        const message = "Account already exists. Please sign in.";
        setError(message);
        toast.error(message);
        return;
      }

      const updatedAccounts = [
        ...savedAccounts,
        { username: normalizedUsername, password: normalizedPassword },
      ];
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));

      setError("");
      setIsSignupMode(false);
      setPassword("");
      setConfirmPassword("");
      toast.success("New account created successfully.");
      return;
    }

    if (savedAccounts.length > 0) {
      const validAccount = savedAccounts.find(
        (account) =>
          String(account.username).toLowerCase() ===
            normalizedUsername.toLowerCase() &&
          account.password === normalizedPassword,
      );

      if (!validAccount) {
        const message = "Invalid username or password.";
        setError(message);
        toast.error(message);
        return;
      }
    } else {
      const message = "No account found. Please create a new account first.";
      setError(message);
      setIsSignupMode(true);
      toast.error(message);
      return;
    }

    setError("");
    dispatch(login(normalizedUsername));
    toast.success("Login successful.");
  };

  if (isAuthenticated) {
    return <Navigate to="/recipes" replace />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <h1 className="h4 mb-3">{isSignupMode ? "Create Account" : "Sign In"}</h1>
        <form className="card card-body" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="form-control mb-3"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
          />

          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="form-control mb-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />

          {isSignupMode ? (
            <>
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className="form-control mb-3"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
              />
            </>
          ) : null}

          {error ? <div className="alert alert-danger py-2">{error}</div> : null}
          <button className="btn btn-primary" type="submit">
            {isSignupMode ? "Create Account" : "Login"}
          </button>

          <button
            className="btn btn-link p-0 mt-3 text-start"
            onClick={() => {
              setError("");
              setPassword("");
              setConfirmPassword("");
              setIsSignupMode((previous) => !previous);
            }}
            type="button"
          >
            {isSignupMode
              ? "Already have an account? Sign In"
              : "New user? Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
