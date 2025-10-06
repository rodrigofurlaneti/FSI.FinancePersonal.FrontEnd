export type Icon = {
  id: number;
  name: string;
  library: string;
  defaultProps: string | null; 
  title: string | null;
  userId?: number;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateIconPayload = {
  name: string;
  library: string;
  defaultProps: string | null; 
  title: string | null;
  userId?: number;
  createdAtUserId?: number | null;
  updatedAtUserId?: number | null;
};

export type UpdateIconPayload = {
  name: string;
  library: string;
  defaultProps: string | null; 
  title: string | null;
  userId?: number;
  updatedAtUserId?: number | null;
};