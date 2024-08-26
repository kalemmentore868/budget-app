import React, { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../component/ExpensesOutput/ExpensesOutput";
import { getDateMinusDays } from "../util/date";
import { ExpensesContext } from "../store/expenses-context";
import { getExpenses } from "../util/http";
import LoadingOverlay from "../component/UI/LoadingOverlay";
import ErrorOverlay from "../component/UI/ErrorOverlay";

const RecentExpenses = () => {
  const { expenses, setExpenses } = useContext(ExpensesContext);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const fetchedExpenses = await getExpenses();
        setExpenses(fetchedExpenses);
      } catch (error) {
        setError("Could not fetch expenses!");
      }

      setIsFetching(false);
    }
    fetchExpenses();
  }, []);

  const recentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date > date7DaysAgo;
  });

  function errorHandler() {
    setError(null);
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <ExpensesOutput
      periodName={"Last 7 days"}
      expenses={recentExpenses}
      fallbackText="No Expenses Registered For the last 7 days"
    />
  );
};

export default RecentExpenses;
