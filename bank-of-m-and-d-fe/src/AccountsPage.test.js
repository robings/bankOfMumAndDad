import React from 'react';
import { render } from '@testing-library/react';
import AccountsPage from './AccountsPage';

test('renders accounts title', () => {
  const { getByText } = render(<AccountsPage />);
  const linkElement = getByText('Accounts');
  expect(linkElement).toBeInTheDocument();
});

test('not logged in gives suitable message', () => {
  const { getByText } = render(<AccountsPage />);
  const loginButton = getByText('Log In');
  const errorMessage = getByText('Unable to display account details.')
  expect(loginButton).toBeInTheDocument();
  expect(errorMessage).toBeInTheDocument();
})
