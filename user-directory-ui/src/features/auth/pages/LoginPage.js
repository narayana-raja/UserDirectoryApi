import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { isAuth0Configured } from "../../../auth/oidcConfig";

function LoginPage() {
  if (!isAuth0Configured) {
    return (
      <div className="page">
        <h1>Sign in</h1>
        <p>Auth0 authentication is not configured for this environment.</p>
      </div>
    );
  }

  return <ConfiguredLoginPage />;
}

function ConfiguredLoginPage() {
  const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/add-user" replace />;
  }

  return (
    <div className="page">
      <h1>Sign in</h1>
      {error && <p className="error">{error.message}</p>}
      <button
        type="button"
        onClick={() =>
          loginWithRedirect({
            appState: { returnTo: location.state?.from?.pathname || "/users" }
          })
        }
        disabled={isLoading}
      >
        {isLoading ? "Preparing sign in..." : "Sign in with Auth0"}
      </button>
    </div>
  );
}

export default LoginPage;
