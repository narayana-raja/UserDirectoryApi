import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { isAuth0Configured } from "../../auth/oidcConfig";
import { setAccessToken } from "../../auth/tokenStore";

function ProtectedRoute({ children }) {
  if (!isAuth0Configured) {
    return <Navigate to="/login" replace />;
  }

  return <AuthenticatedRoute>{children}</AuthenticatedRoute>;
}

function AuthenticatedRoute({ children }) {
  const {
    getAccessTokenSilently,
    isLoading,
    isAuthenticated,
    error
  } = useAuth0();
  const location = useLocation();
  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAccessToken() {
      if (!isAuthenticated) {
        return;
      }

      const accessToken = await getAccessTokenSilently();
      setAccessToken(accessToken);

      if (isMounted) {
        setIsTokenReady(true);
      }
    }

    loadAccessToken().catch(() => {
      if (isMounted) {
        setIsTokenReady(false);
      }
    });

    return () => {
      isMounted = false;
      setAccessToken(null);
    };
  }, [getAccessTokenSilently, isAuthenticated]);

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (error) {
    return <p>Authentication failed: {error.message}</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isTokenReady) {
    return <p>Preparing secure session...</p>;
  }

  return children;
}

export default ProtectedRoute;
