export const db = {
  transactions: [
    { id: 1, date: "2026-03-12", category: "Groceries", type: "expense", amount: 40, description: "" },
    { id: 2, date: "2026-03-13", category: "Transport", type: "expense", amount: 20, description: "" },
  ],
  nextId: 3,
};

export function addTransaction({ date, category, type, amount, description }) {
  const txn = {
    id: db.nextId++,
    date,
    category,
    type,
    amount,
    description: description ?? "",
  };
  db.transactions.unshift(txn);
  return txn;
}

export function listTransactions() {
  return db.transactions;
}