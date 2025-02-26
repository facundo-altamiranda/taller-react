interface CreateTransactionDTO {
  description: string;
  amount: number;
}

interface Transaction extends CreateTransactionDTO {
  id: number;
  date: Date;
}

interface DB {
  transactions: Transaction[];
  _idCounter: number;
}

interface Pagination {
  page: number;
  totalPages: number;
  limit: number;
}

interface ResponseDTOWithPagination<T> {
  data: T;
  pagination: Pagination;
}

interface SearchParams {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  totalPages: number;
}

interface SearchAction {
  type: "SET_PARAM";
  payload: Partial<SearchParams>;
}
