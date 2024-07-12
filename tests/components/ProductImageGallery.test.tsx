import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {

  it('should render nothing if given an empty array', () => {
    const result = render(<ProductImageGallery imageUrls={[]} />);
    expect(result.container).toBeEmptyDOMElement();
  });

  it('should render a list of images', () => {
    const randomImageUrl = (size: number) => (`https://picsum.photos/${size}`);
    const imageUrls = [randomImageUrl(200), randomImageUrl(300), randomImageUrl(400)];
    render(<ProductImageGallery imageUrls={imageUrls} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url);
    });
  });

});
