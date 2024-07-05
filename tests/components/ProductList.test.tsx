import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { db } from '../mocks/db';


describe('ProductList', () => {

  const productIds: number[] = [];

  beforeAll(() => {
    for(let i = 0; i < 3; i += 1) {
      const product = db.product.create();
      productIds.push(product.id);
    }
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds }}});
  });

  it('should render the list of products', async () => {
    render(<ProductList />);
    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render no products available if no product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));
    render(<ProductList />);
    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it('should render an error message', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    render(<ProductList />);
    
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

});
