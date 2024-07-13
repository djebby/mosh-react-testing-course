import { useQuery } from "react-query";
import axios from "axios";
import { Select } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";

import { Category } from "../entities";

interface Props {
  onChange: (categoryId: number) => void;
}

const CategorySelect = ({ onChange }: Props) => {
  
  const categoriesQuery = useQuery<Category[], Error>({
    queryFn: () => axios.get<Category[]>("/categories").then(res => res.data),
    queryKey: ['categories'],
  });

  if (categoriesQuery.isLoading) return (
    <div role="progressbar" aria-label="loading categories">
      <Skeleton />
    </div>
  );
  if (categoriesQuery.error) return null;
  return (
    <Select.Root
      onValueChange={(categoryId) => onChange(parseInt(categoryId))}
    >
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categoriesQuery.data?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default CategorySelect;
