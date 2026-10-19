export type AccountId = string;
export type CategoryId = string;
export type TransactionId = string;
export type CurrencyCode = string;

export interface Money {
  /** Amount in the currency's minor unit (for example, cents). */
  amountMinor: number;
  currency: CurrencyCode;
}

export type AccountType = "checking" | "savings" | "cash" | "credit";

export interface Account {
  id: AccountId;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  openingBalance: Money;
}

export type CategoryType = "income" | "expense";

export interface Category {
  id: CategoryId;
  name: string;
  type: CategoryType;
}

interface TransactionBase {
  id: TransactionId;
  date: string;
  description: string;
  amount: Money;
}

export interface IncomeTransaction extends TransactionBase {
  type: "income";
  accountId: AccountId;
  categoryId: CategoryId;
}

export interface ExpenseTransaction extends TransactionBase {
  type: "expense";
  accountId: AccountId;
  categoryId: CategoryId;
}

export interface TransferTransaction extends TransactionBase {
  type: "transfer";
  fromAccountId: AccountId;
  toAccountId: AccountId;
}

export type Transaction =
  | IncomeTransaction
  | ExpenseTransaction
  | TransferTransaction;

export interface Budget {
  categoryId: CategoryId;
  period: {
    startDate: string;
    endDate: string;
  };
  limit: Money;
}

export interface FinancialManagementModel {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
}

export const exampleModel: FinancialManagementModel = {
  accounts: [
    {
      id: "checking",
      name: "Everyday checking",
      type: "checking",
      currency: "USD",
      openingBalance: { amountMinor: 250000, currency: "USD" },
    },
    {
      id: "savings",
      name: "Emergency savings",
      type: "savings",
      currency: "USD",
      openingBalance: { amountMinor: 1000000, currency: "USD" },
    },
  ],
  categories: [
    { id: "salary", name: "Salary", type: "income" },
    { id: "groceries", name: "Groceries", type: "expense" },
    { id: "housing", name: "Housing", type: "expense" },
  ],
  transactions: [
    {
      id: "paycheck-001",
      date: "2026-10-01",
      description: "October paycheck",
      type: "income",
      accountId: "checking",
      categoryId: "salary",
      amount: { amountMinor: 400000, currency: "USD" },
    },
    {
      id: "groceries-001",
      date: "2026-10-03",
      description: "Weekly groceries",
      type: "expense",
      accountId: "checking",
      categoryId: "groceries",
      amount: { amountMinor: 8500, currency: "USD" },
    },
    {
      id: "transfer-001",
      date: "2026-10-05",
      description: "Monthly savings contribution",
      type: "transfer",
      fromAccountId: "checking",
      toAccountId: "savings",
      amount: { amountMinor: 50000, currency: "USD" },
    },
  ],
  budgets: [
    {
      categoryId: "groceries",
      period: { startDate: "2026-10-01", endDate: "2026-10-31" },
      limit: { amountMinor: 60000, currency: "USD" },
    },
    {
      categoryId: "housing",
      period: { startDate: "2026-10-01", endDate: "2026-10-31" },
      limit: { amountMinor: 150000, currency: "USD" },
    },
  ],
};
