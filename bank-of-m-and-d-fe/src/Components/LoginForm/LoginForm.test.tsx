import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('login form', () => {
  const renderLoginForm = () => {
    render(<LoginForm setLoginMessage={() => {}}/>)
  };

  test('displays title', () => {
    renderLoginForm();
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });
  
  test('displays username input', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });
  
  test('displays password input', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
