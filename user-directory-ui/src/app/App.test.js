import { render, screen } from '@testing-library/react';
import App from './App';
import { getUsers } from '../features/users/services/userApi';

jest.mock('../features/users/services/userApi', () => ({
  getUsers: jest.fn()
}));

test('redirects the root route to the login page when Auth0 is not configured', async () => {
  render(<App />);

  expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  expect(screen.getByText(/Auth0 authentication is not configured/i)).toBeInTheDocument();
});
