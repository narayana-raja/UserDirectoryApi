import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import './App.css';
import { auth0Config, isAuth0Configured } from '../auth/oidcConfig';
import NavigationBar from '../components/layout/NavigationBar';
import UserListPage from '../features/users/pages/UserListPage';
import UserFormPage from '../features/users/pages/UserFormPage';
import LoginPage from '../features/auth/pages/LoginPage';

function AppRoutes() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Navigate to="/users" />}/>
        <Route path='/users' element={<ProtectedRoute><UserListPage /></ProtectedRoute>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route
          path='/add-user'
          element={
            <ProtectedRoute>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
        <Route path='/authentication/callback' element={<p>Completing sign in...</p>} />
      </Routes>
    </>
  );
}

function App() {
  const routes = (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );

  if (!isAuth0Configured) {
    return routes;
  }

  return (
    <Auth0Provider
      {...auth0Config}
      onRedirectCallback={(appState) => {
        const returnTo = appState?.returnTo || "/users";
        window.history.replaceState({}, document.title, returnTo);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }}
    >
      {routes}
    </Auth0Provider>
  );
}

export default App;
