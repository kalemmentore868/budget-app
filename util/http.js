import axios from "axios";

const BACKEND_URL = "https://budget-app-9aa6d-default-rtdb.firebaseio.com";

export async function storeExpense(expenseData) {
  const response = await axios.post(
    `${BACKEND_URL}/expenses.json`,
    expenseData
  );
  const id = response.data.name;
  return id;
}

export async function getExpenses() {
  const response = await axios.get(`${BACKEND_URL}/expenses.json`);
  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      description: response.data[key].description,
      date: new Date(response.data[key].date),
    };

    expenses.push(expenseObj);
  }

  return expenses;
}

export function updateExpenseHttp(id, expenseData) {
  return axios.put(`${BACKEND_URL}/expenses/${id}.json`, expenseData);
}

export function deleteExpenseHttp(id) {
  return axios.delete(`${BACKEND_URL}/expenses/${id}.json`);
}
