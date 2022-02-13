import { render, screen } from '@testing-library/react';
import appStrings from "../../constants/app.strings";
import LoginForm from "./LoginForm";

describe("login form", () => {
  const renderLoginForm = () => {
    render(<LoginForm setLoginMessage={() => {}} />);
  };

  test("displays title", () => {
    renderLoginForm();
    expect(
      screen.getByRole("heading", { name: appStrings.loginForm.title })
    ).toBeInTheDocument();
  });

  test("displays username input", () => {
    renderLoginForm();
    expect(
      screen.getByLabelText(appStrings.loginForm.usernameLabel)
    ).toBeInTheDocument();
  });

  test("displays password input", () => {
    renderLoginForm();
    expect(
      screen.getByLabelText(appStrings.loginForm.passwordLabel)
    ).toBeInTheDocument();
  });
});
