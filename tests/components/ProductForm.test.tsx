import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { Category, Product } from '../../src/entities';

describe('ProductForm', () => {

  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });


  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id }}});
  });


  const renderComponent = (product?: Product) => {
    render(<ProductForm onSubmit={vi.fn()} product={product} />, { wrapper: AllProviders });
    return {
      waitForFormToLoad: async () => {
        await screen.findByRole('form');
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole('combobox', { name: /category/i }),
        }
      }
    }
  };


  it('should render form fields', async () => {
    const { waitForFormToLoad } = renderComponent();
    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();
    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });


  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Bread',
      price: 10,
      categoryId: category.id,
    };
    const { waitForFormToLoad } = renderComponent(product);
    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();
    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(String(product.price));
    expect(categoryInput).toHaveTextContent(String(category.name));
  });


  it('should put focus on the name field', async () => {
    const { waitForFormToLoad } = renderComponent();
    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  });
});
