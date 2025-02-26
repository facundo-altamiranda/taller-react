import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { validateDates } from "./utils/validation";
import { PAGINATION_LIMIT } from "./utils/constants";

const networkErrorProbability = 50 / 100;
const isNetworkDown = () => networkErrorProbability < Math.random();
const networkErrorResponse = HttpResponse.error();

const db: DB = {
  transactions: [
    {
      id: 1,
      description: "Groceries",
      date: new Date("December 19, 2022 03:24:00"),
      amount: 400,
    },
    {
      id: 2,
      description: "Gas",
      date: new Date("December 18, 2023 03:24:00"),
      amount: 300,
    },
    {
      id: 3,
      description: "Restaurant",
      date: new Date("December 17, 2024 03:24:00"),
      amount: 200,
    },
    {
      id: 4,
      description: "Online Purchase",
      date: new Date("December 16, 2022 10:15:00"),
      amount: 150,
    },
    {
      id: 5,
      description: "Rent",
      date: new Date("December 15, 2023 18:30:00"),
      amount: 1200,
    },
    {
      id: 6,
      description: "Coffee",
      date: new Date("December 14, 2024 08:45:00"),
      amount: 50,
    },
    {
      id: 7,
      description: "Movie Tickets",
      date: new Date("December 13, 2022 20:00:00"),
      amount: 80,
    },
    {
      id: 8,
      description: "Books",
      date: new Date("December 12, 2023 14:20:00"),
      amount: 100,
    },
    {
      id: 9,
      description: "Gym Membership",
      date: new Date("December 11, 2024 06:00:00"),
      amount: 75,
    },
  ],
  _idCounter: 9,
};

const handlers = [
  http.get("/api/v1/transactions", ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const page = url.searchParams.get("page") || 1;
    const datesValidated = validateDates(startDate, endDate);
    let transactions = [...db.transactions];

    if (datesValidated) {
      transactions = db.transactions.filter((transaction) => {
        const date = new Date(transaction.date);
        const startDateFilter = new Date(startDate!);
        const endDateFilter = new Date(endDate!);

        return date >= startDateFilter && date <= endDateFilter;
      });
    }

    const totalPages = Math.ceil(transactions.length / PAGINATION_LIMIT);
    const data = transactions.slice(
      PAGINATION_LIMIT * (Number(page) - 1),
      PAGINATION_LIMIT * Number(page)
    );

    const response = {
      data,
      pagination: {
        page: Number(page),
        limit: PAGINATION_LIMIT,
        totalPages,
      },
    };

    return HttpResponse.json<ResponseDTOWithPagination<Transaction[]>>(
      response
    );
  }),

  http.post("/api/v1/transactions", async ({ request }) => {
    if (isNetworkDown()) return networkErrorResponse;

    const newTransaction = (await request.json()) as CreateTransactionDTO;

    const transaction: Transaction = {
      id: ++db._idCounter,
      date: new Date(),
      ...newTransaction,
    };

    db.transactions.push(transaction);

    return HttpResponse.json<Transaction>(transaction, { status: 201 });
  }),
];

const worker = setupWorker(...handlers);

export const bootMockApi = async () => {
  try {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
    console.log("Mock Service Worker started successfully");
  } catch (error) {
    console.error("Failed to start Mock Service Worker:", error);
  }
};
