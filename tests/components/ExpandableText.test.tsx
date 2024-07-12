import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {

  const limit = 255;
  const shortText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'.slice(0, limit-2);
  const longText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam possimus quos molestiae eum, esse rerum quibusdam quas voluptatibus libero facilis! Harum facere aliquid iste officia deleniti, ea obcaecati aperiam ab tempore deserunt dolore commodi neque vel assumenda? Sed quae asperiores quibusdam delectus accusamus nesciunt labore et quod. Provident, ex fuga.'.padEnd(limit+2, 'lorem');
  
  it(`should render the full text if his length under ${limit} char.`, () => {
    
    render(<ExpandableText text={shortText} />);
    const article = screen.getByRole('article');
    
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(shortText);

  });


  it(`should truncate text if his longer than ${limit} characters and a Show More button.`, () => {
    render(<ExpandableText text={longText} />);
    const article = screen.getByRole('article');
    const button = screen.getByRole('button');

    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(`${longText.substring(0, limit)}...`);
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });
  
  
  it('should expand and collapse text when Show More/Less buttons are clicked', async () => {
    
    render(<ExpandableText text={longText} />);
    const article = screen.getByRole('article');
    const showMoreBtn = screen.getByRole('button', { name: /more/i });
    const user = userEvent.setup();

    await user.click(showMoreBtn); // expand
    expect(article).toHaveTextContent(longText);
    
    const showLessBtn = screen.getByRole('button', { name: /less/i });
    await user.click(showLessBtn); // collapse
    expect(article).toHaveTextContent(`${longText.substring(0, limit)}...`);
  });

});

