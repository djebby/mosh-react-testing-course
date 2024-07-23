import { render, screen } from '@testing-library/react';
import { CartProvider } from '../../src/providers/CartProvider';
import QuantitySelector from '../../src/components/QuantitySelector';
import userEvent from '@testing-library/user-event';
import { Product } from '../../src/entities';

describe('QuantitySelector', () => {

  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: 'Milk',
      price: 5,
      categoryId: 1,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const getAddToCartButton = () => screen.queryByRole('button', { name: /add to cart/i });
    const user = userEvent.setup();
    const getQuantityControls = () => ({
      quantity: screen.queryByRole('status'),
      decrementButton: screen.queryByRole('button', { name: '-' }),
      incrementButton: screen.queryByRole('button', { name: '+' }),
    });

    const addToCart = async () => await user.click(getAddToCartButton()!);

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };
    
    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };


    return {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    }
  };
  
  it('should render the Add to Cart button', () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });


  it('should add the product to the cart', async () => {
    const { getAddToCartButton, addToCart, getQuantityControls } = renderComponent();
    await addToCart();
    const { quantity, decrementButton, incrementButton } = getQuantityControls();
    expect(quantity).toHaveTextContent('1');
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });


  it('should increment the quantity', async () => {
    const { addToCart, getQuantityControls, incrementQuantity } = renderComponent();
    await addToCart();
    await incrementQuantity();
    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent('2');
  });


  it('should decrement the quantity', async () => {
    const { addToCart, getQuantityControls, incrementQuantity, decrementQuantity } = renderComponent();
    await addToCart();
    await incrementQuantity();
    await decrementQuantity();
    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent('1');
  });
  
  
  it('should remove the product from the cart', async () => {
    const { getAddToCartButton, addToCart, getQuantityControls, decrementQuantity } = renderComponent();
    await addToCart();
    await decrementQuantity();
    const { quantity, decrementButton, incrementButton } = getQuantityControls();
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

});
