import { render, screen } from '@testing-library/react';
import App from './App';
import { getUsers } from './services/userService';

jest.mock('./services/userService', () => ({
  getUsers: jest.fn()
}));

test('redirects the root route to the users page', async () => {
  getUsers.mockResolvedValue([]);
  render(<App />);

  expect(await screen.findByRole('heading', { name: 'User List' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Users' })).toHaveClass('active');
});
