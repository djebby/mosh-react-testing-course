import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { db } from '../mocks/db';
import { QueryClient, QueryClientProvider } from 'react-query';


describe('ProductList', () => {

  const renderComponent = () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        }
      }
    });

    render(
      <QueryClientProvider client={client}>
        <ProductList />
      </QueryClientProvider>
    );
  }

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
    renderComponent();
    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });


  it('should render no products available if no product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));
    renderComponent();
    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });


  it('should render an error message', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });


  it('should render a loading indicator when fetching data', async () => {
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }));
    renderComponent();
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });


  it('should remove the loading indicator after data is fetched', async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });


  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    renderComponent();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

});
