import { render, screen } from '@testing-library/react';
import { mockAuthState } from '../utils/utils';
import AuthStatus from '../../src/components/AuthStatus';
import { faker } from '@faker-js/faker';

describe('AuthStatus', () => {
  it('should render the loading message while fetching the auth status', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });

  
  it('should render the login button if the user is not authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });


  it('should render the user name if authenticated', () => {
    const userName = faker.internet.userName();
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: userName },
    });

    render(<AuthStatus />);

    expect(screen.getByText(userName)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });
});
