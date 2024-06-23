import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {

  const renderComponent = () => {
    render(<TermsAndConditions />);
    const heading = screen.getByRole('heading');
    const checkbox = screen.getByRole('checkbox');
    const button = screen.getByRole('button');

    return {
      heading,
      checkbox,
      button,
    };
  }

  it('should render with correct text and initial state', () => {
    const { heading, checkbox, button } = renderComponent();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Terms & Conditions');
    
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    screen.debug();
  });

  it('should enable the button when the checkbox is checked', async () => {
    const { checkbox, button } = renderComponent();
    const user = userEvent.setup();
    await user.click(checkbox);
    expect(button).toBeEnabled();
  });

});
