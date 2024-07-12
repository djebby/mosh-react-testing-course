import { render, screen } from '@testing-library/react';
import { User } from '../../src/entities';
import UserList from '../../src/components/UserList';

describe('UserList', () => {
  
  it('should render no user available message if user array is empty', () => {
    const users: User[] = [];

    render(<UserList users={users} />);
    const paragraph = screen.getByText(/no users/i);

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(/no users available./i);

  });
  
  
  it('should render no user available message if user array is empty', () => {
    const users: User[] = [
      { id: 1, name: 'Gilfoyle' },
      { id: 2, name: 'Dinesh' },
    ];

    render(<UserList users={users} />);

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    });

  });

});
