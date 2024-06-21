import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';


describe('UserAccount', () => {
  it('should render user name', () => {
    // Arrange
    const user: User = {id: 10, name: 'donald', isAdmin: false};
    // Act
    render(<UserAccount user={user} />);
    const nameDiv = screen.getByText(/donald/i);
    screen.debug();
    // Assert
    expect(nameDiv).toBeInTheDocument();
  });
  
  it('should render edit button if user is admin', () => {
    // Arrange
    const user: User = {id: 10, name: 'donald', isAdmin: true};
    // Act
    render(<UserAccount user={user} />);
    const editBtn = screen.getByRole('button');
    screen.debug();
    // Assert
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveTextContent(/edit/i);
  });
  
  it('should not render edit button if user is admin', () => {
    // Arrange
    const user: User = {id: 10, name: 'donald', isAdmin: false};
    // Act
    render(<UserAccount user={user} />);
    const editBtn = screen.queryByRole('button'); // screen.getByRole('button'); => this expression will throw an error, button is not in the dom
    screen.debug();
    // Assert
    expect(editBtn).not.toBeInTheDocument();
  });

});




