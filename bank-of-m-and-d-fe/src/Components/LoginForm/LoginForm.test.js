import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './LoginForm';
import { LogIn } from '../../ApiService/ApiUserService';

jest.mock('../../ApiService/ApiUserService');

afterEach(() => {
  jest.clearAllMocks();
});

describe('login form', () => {
  test('displays title', () => {
    render(<LoginForm />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  
  test('displays username input', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });
  
  test('displays password input', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });  
});
