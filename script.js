const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const list = document.getElementById("expense-list");
const totalText = document.getElementById("total");
const submitBtn = document.getElementById("submit-btn"); // NEW

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingId = null; // NEW

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function showExpenses() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach(function (expense) {
    const li = document.createElement("li");
    li.textContent = expense.title + " - ₹" + expense.amount;

    // NEW: Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.addEventListener("click", function () {
      startEdit(expense.id);
    });
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteExpense(expense.id);
    });
    li.appendChild(deleteBtn);

    list.appendChild(li);
    total = total + expense.amount;
  });

  totalText.textContent = total;
}

function deleteExpense(id) {
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });

  // NEW: leave edit mode if the edited item was deleted
  if (editingId === id) {
    editingId = null;
    submitBtn.textContent = "Add";
    form.reset();
  }

  saveExpenses();
  showExpenses();
}

// NEW: whole function
function startEdit(id) {
  const expense = expenses.find(function (item) {
    return item.id === id;
  });

  titleInput.value = expense.title;
  amountInput.value = expense.amount;
  editingId = id;
  submitBtn.textContent = "Update";
}

// CHANGED: if/else inside
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value;
  const amount = Number(amountInput.value);

  if (editingId !== null) {
    expenses = expenses.map(function (item) {
      if (item.id === editingId) {
        return { id: item.id, title: title, amount: amount };
      }
      return item;
    });
    editingId = null;
    submitBtn.textContent = "Add";
  } else {
    const expense = {
      id: Date.now(),
      title: title,
      amount: amount
    };
    expenses.push(expense);
  }

  saveExpenses();
  showExpenses();
  form.reset();
});

showExpenses();