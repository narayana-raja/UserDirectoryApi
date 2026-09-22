import { render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";

test("explains when Auth0 is not configured", () => {
  render(<LoginPage />);

  expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  expect(screen.getByText(/Auth0 authentication is not configured/i)).toBeInTheDocument();
});
