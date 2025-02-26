import { Card } from "react-bootstrap";
import { MONTHS } from "../utils/constants";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const transactionDate = new Date(transaction.date);
  const date = `${
    MONTHS[transactionDate.getMonth()]
  } ${transactionDate.getDate()} ${transactionDate.getFullYear()}`;

  return (
    <Card>
      <Card.Body className="px-1">
        <Card.Title>Transaction #{transaction.id}</Card.Title>
        <Card.Body>
          <Card.Text>Description: {transaction.description}</Card.Text>
          <Card.Text>Date: {date}</Card.Text>
          <Card.Text>Amount: ${Math.round(transaction.amount)} USD</Card.Text>
        </Card.Body>
      </Card.Body>
    </Card>
  );
}
