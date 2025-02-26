import React, { useEffect, useReducer, useState } from "react";
import {
  Button,
  Container,
  Row,
  InputGroup,
  Form,
  Toast,
  Col,
  ToastContainer,
  Pagination,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { createTransaction, getTransactions } from "./services/transactions";
import { TransactionCard } from "./components/transaction-card";
import { validateDates } from "./utils/validation";
import { NewTransactionModal } from "./components/new-transaction-modal";
import { PAGINATION_LIMIT } from "./utils/constants";

const initialState: SearchParams = {
  page: 1,
  limit: PAGINATION_LIMIT,
  startDate: "",
  endDate: "",
  totalPages: 1,
  // sort: 'price',
  // order: 'desc',
};

function searchParamsReducer(state: SearchParams, action: SearchAction) {
  switch (action.type) {
    case "SET_PARAM":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function App() {
  const [searchParams, dispatch] = useReducer(
    searchParamsReducer,
    initialState
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchTransactions();
  }, [searchParams.page, searchParams.startDate, searchParams.endDate]);

  const fetchTransactions = async () => {
    try {
      let searchQuery = `?page=${searchParams.page}`;
      const datesValidated = validateDates(
        searchParams.startDate,
        searchParams.endDate
      );

      if (datesValidated) {
        searchQuery += `&startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`;
      }

      const response = await getTransactions(searchQuery);

      setTransactions(response.data);
      dispatch({
        type: "SET_PARAM",
        payload: { totalPages: response.pagination.totalPages },
      });
      setError(null);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      setError(errorMessage);
    }
  };

  const addTransaction = async ({
    amount,
    description,
  }: CreateTransactionDTO) => {
    try {
      const newTransaction = await createTransaction({ amount, description });

      setTransactions([...transactions, newTransaction]);
      setError(null);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      setError(errorMessage);
    }
  };

  return (
    <div className="App">
      <Container className="mt-4">
        {showModal && (
          <NewTransactionModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleNewTransaction={addTransaction}
          />
        )}
        {error && (
          <ToastContainer position="bottom-end">
            <Toast bg="danger" onClose={() => setError(null)}>
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body className="text-start">{error}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}

        <h1>Transactions</h1>
        <Button onClick={() => setShowModal(true)} className="mb-3">
          Add Transaction
        </Button>

        <h3>Filter by date</h3>
        <Row className="gap-4 mb-3 mx-0">
          <InputGroup className="col px-0">
            <InputGroup.Text>From</InputGroup.Text>
            <Form.Control
              placeholder="MM/DD/YYYY"
              aria-label="Start Date"
              onChange={(event) =>
                dispatch({
                  type: "SET_PARAM",
                  payload: { startDate: event.target.value },
                })
              }
              value={searchParams.startDate}
            />
          </InputGroup>
          <InputGroup className="col px-0">
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control
              placeholder="MM/DD/YYYY"
              aria-label="End Date"
              onChange={(event) =>
                dispatch({
                  type: "SET_PARAM",
                  payload: { endDate: event.target.value },
                })
              }
              value={searchParams.endDate}
            />
          </InputGroup>
        </Row>

        <Row>
          {transactions.map((transaction) => (
            <Col key={transaction.id} lg={3} sm={4} xs={12} className="mb-3">
              <TransactionCard transaction={transaction} />
            </Col>
          ))}
        </Row>
        {!transactions.length && <h2>No Transactions</h2>}
        <Pagination size="lg" className="justify-content-center">
          <Pagination.Prev
            disabled={searchParams.page === 1}
            onClick={() =>
              dispatch({
                type: "SET_PARAM",
                payload: { page: searchParams.page - 1 },
              })
            }
          />
          <Pagination.Item active>{searchParams.page}</Pagination.Item>
          <Pagination.Next
            disabled={searchParams.page === searchParams.totalPages}
            onClick={() =>
              dispatch({
                type: "SET_PARAM",
                payload: { page: searchParams.page + 1 },
              })
            }
          />
        </Pagination>
      </Container>
    </div>
  );
}

export default App;
