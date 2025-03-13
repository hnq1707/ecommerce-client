export type CategoryType = {
  id: string;
  name: string;
  code: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  code: string;
  description: string;
  categoryTypes: CategoryType[];
};
