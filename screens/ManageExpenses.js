import React, { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import IconButton from "../component/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../component/UI/Button";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../component/ManageExpense/ExpenseForm";
import {
  deleteExpenseHttp,
  storeExpense,
  updateExpenseHttp,
} from "../util/http";
import LoadingOverlay from "../component/UI/LoadingOverlay";
import ErrorOverlay from "../component/UI/ErrorOverlay";

const ManageExpenses = ({ route, navigation }) => {
  const { deleteExpense, addExpense, updateExpense, expenses } =
    useContext(ExpensesContext);
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const selectedExpense = expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpenseHttp(editedExpenseId);
      deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could Not delete expense");
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        updateExpense(editedExpenseId, expenseData);
        await updateExpenseHttp(editedExpenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        addExpense({ ...expenseData, id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later");
      setIsSubmitting(false);
    }
  }

  function errorHandler() {
    setError(null);
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onCancel={cancelHandler}
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={24}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
};

export default ManageExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
