export async function getTransactions(
  searchParams: string
): Promise<ResponseDTOWithPagination<Transaction[]>> {
  try {
    const response = await fetch(`/api/v1/transactions${searchParams}`);
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function createTransaction({
  amount,
  description,
}: CreateTransactionDTO): Promise<Transaction> {
  try {
    const response = await fetch("/api/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        amount,
      }),
    });
    const newTransaction = await response.json();

    return newTransaction;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
