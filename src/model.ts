/**
 * Core domain types for a personal financial-management model.
 *
 * The model is a snapshot of accounts, categories, transactions, and budgets.
 * Money is stored as integer minor units so totals stay exact (no floating-point
 * rounding). Dates are ISO calendar strings (`YYYY-MM-DD`).
 */

/** Opaque identifier for an `Account`. */
export type AccountId = string;
/** Opaque identifier for a `Category`. */
export type CategoryId = string;
/** Opaque identifier for a `Transaction`. */
export type TransactionId = string;
/** ISO 4217 currency code, e.g. `"USD"`. */
export type CurrencyCode = string;

/** A signed monetary value in a single currency. */
export interface Money {
  /**
   * Amount in the currency's minor unit (for example, cents).
   * Direction of a movement comes from the transaction `type`, not the sign.
   */
  amountMinor: number;
  currency: CurrencyCode;
}

/**
 * Kind of account. `"credit"` is a liability (balances typically decrease as
 * you pay it down); the others are assets.
 */
export type AccountType = "checking" | "savings" | "cash" | "credit";

/** A place money is held: bank account, cash, or credit facility. */
export interface Account {
  id: AccountId;
  name: string;
  type: AccountType;
  /** Currency this account is denominated in. */
  currency: CurrencyCode;
  /**
   * Balance before any listed transactions. Combined with later activity to
   * derive the current balance.
   */
  openingBalance: Money;
}

/** Whether a category is used for money coming in or going out. */
export type CategoryType = "income" | "expense";

/**
 * A label for grouping income or expense transactions (e.g. Salary, Groceries).
 * Transfers do not use categories.
 */
export interface Category {
  id: CategoryId;
  name: string;
  type: CategoryType;
}

/** Fields shared by every transaction variant. */
interface TransactionBase {
  id: TransactionId;
  /** Calendar date the transaction occurred (`YYYY-MM-DD`). */
  date: string;
  description: string;
  /** Magnitude of the movement; always a positive amount in practice. */
  amount: Money;
}

/** Money received into one account, classified by an income category. */
export interface IncomeTransaction extends TransactionBase {
  type: "income";
  accountId: AccountId;
  categoryId: CategoryId;
}

/** Money spent from one account, classified by an expense category. */
export interface ExpenseTransaction extends TransactionBase {
  type: "expense";
  accountId: AccountId;
  categoryId: CategoryId;
}

/**
 * Movement between two of the user's own accounts. Not income or expense, so
 * it has no category.
 */
export interface TransferTransaction extends TransactionBase {
  type: "transfer";
  fromAccountId: AccountId;
  toAccountId: AccountId;
}

/**
 * Discriminated union of ledger events. Narrow on `type` to access
 * account/category fields that only exist on some variants.
 */
export type Transaction =
  | IncomeTransaction
  | ExpenseTransaction
  | TransferTransaction;

/**
 * A spending cap for one expense category over a closed date range.
 * Compare against expense transactions whose `date` falls in `period`.
 */
export interface Budget {
  categoryId: CategoryId;
  period: {
    startDate: string;
    endDate: string;
  };
  limit: Money;
}

/**
 * Complete in-memory dataset for the financial-management product.
 * Referential integrity (account/category ids on transactions and budgets)
 * is assumed, not enforced by these types.
 */
export interface FinancialManagementModel {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
}

/** Sample snapshot used for local development and tests. Amounts are USD cents. */
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
