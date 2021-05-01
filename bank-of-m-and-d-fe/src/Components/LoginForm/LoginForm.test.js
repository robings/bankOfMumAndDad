import React from 'react';
import { render } from '@testing-library/react';
import LoginForm from './LoginForm';

test('renders login form title', () => {
  const { getByText } = render(<LoginForm />);
  const loginTitle = getByText('Login');
  expect(loginTitle).toBeInTheDocument();
});

test('renders login form username input', () => {
  const { getByText } = render(<LoginForm />);
  const usernameLabel = getByText('Username');
  expect(usernameLabel).toBeInTheDocument();
})

test('renders login form password input', () => {
  const { getByText } = render(<LoginForm />);
  const passwordLabel = getByText('Password');
  expect(passwordLabel).toBeInTheDocument();
})
