import { useState } from "react";
import { Table } from "@radix-ui/themes";
import axios from "axios";
import { useQuery } from "react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuantitySelector from "../components/QuantitySelector";
import { Product } from "../entities";
import CategorySelect from "../components/CategorySelect";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();
  
  const productsQuery = useQuery<Product[], Error>({
    queryFn: () => axios.get<Product[]>("/products").then(res => res.data),
    queryKey: ['products'],
  });


  if (productsQuery.error) return <div>Error: {productsQuery.error.message}</div>;


  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];

    if (productsQuery.error) return <div>Error: {productsQuery.error.message}</div>;

    const visibleProducts = selectedCategoryId
      ? productsQuery.data!.filter((p) => p.categoryId === selectedCategoryId)
      : productsQuery.data;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body
          role={productsQuery.isLoading ? 'progressbar' : undefined}
          aria-label={productsQuery.isLoading ? 'loading products' : undefined}
        >
          {productsQuery.isLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!productsQuery.isLoading &&
            visibleProducts!.map((product) => (
              <Table.Row key={product.id} data-testid="data-row">
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategorySelect onChange={setSelectedCategoryId} />
      </div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
