import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface NewTransactionModalProps {
  show: boolean;
  handleClose: () => void;
  handleNewTransaction: ({
    amount,
    description,
  }: CreateTransactionDTO) => Promise<void>;
}

export function NewTransactionModal({
  show,
  handleClose,
  handleNewTransaction,
}: NewTransactionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const isValid = !!amount && !!description && !isNaN(Number(amount));

  const createTransaction = async () => {
    await handleNewTransaction({ amount: Number(amount), description });
    handleClose();
  };

  return (
    <Modal className="text-black" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              placeholder="Description"
              autoFocus
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              placeholder="Amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={createTransaction}
          disabled={!isValid}
        >
          Create Transaction
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
