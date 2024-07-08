import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import { server } from '../mocks/server';
import { db } from '../mocks/db';
import AllProviders from '../AllProviders';

describe('ProductDetail', () => {

  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId} }});
  });

  
  it('should render the product detail', async () => {
    const product = db.product.findFirst({ where: { id: { equals: productId }}});
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });
    expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument();
  });

  it('should render message if product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });
  
  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });
    const message = await screen.findByText(/Invalid ProductId/i);
    screen.debug();
    expect(message).toBeInTheDocument();
  });

  it('should render an error if data fetching fails', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    const message = await screen.findByText(/error/i);
    screen.debug();
    expect(message).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    server.use(http.get('/products/1', async () => {
      await delay();
      return HttpResponse.json({id: 1, name: 'Product 1', price: 10});
    }));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator after data is fetched', async () => {
    server.use(http.get('/products/1', async () => {
      await delay();
      return HttpResponse.json({id: 1, name: 'Product 1', price: 10});
    }));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  
  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products/1', async () => {
      await delay();
      return HttpResponse.error();
    }));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });


});
