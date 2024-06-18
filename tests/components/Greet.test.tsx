import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';
import '@testing-library/jest-dom/vitest';

describe('Greet', () => {
  it('should render Hello with the name when name is provided', () => {
    // Act
    render(<Greet name={'john'} />);
    const heading = screen.getByRole('heading');
    screen.debug();
    // Assert
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/john/i);
  });
  
  it('should render login button when name is not provided', () => {
    // Act
    render(<Greet />);
    const button = screen.getByRole('button');
    screen.debug();
    // Assert
    expect(button).toBeInTheDocument();
  });


});


