import React, { useContext } from "react";
import ExpensesOutput from "../component/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";

const AllExpenses = () => {
  const { expenses } = useContext(ExpensesContext);
  return (
    <ExpensesOutput
      periodName={"Total"}
      expenses={expenses}
      fallbackText="No Expenses Registered"
    />
  );
};

export default AllExpenses;
