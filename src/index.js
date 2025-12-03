import Todo from "./todo";

const content = document.getElementById("content");

content.innerHTML = `
<p>Towards a productive day</p>
<div id=taslist></div>
<button id="add-todo">Add Todo</button>
<dialog id="todo-dialog">
  <form method="dialog">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required />
    <br />
    <label for="description">Description:</label>
    <textarea id="description" name="description" required></textarea>
    <br />
    <label for="dueDate">Due Date:</label>
    <input type="date" id="dueDate" name="dueDate" required />
    <br />
    <label for="priority">Priority:</label>
    <select id="priority" name="priority" required>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <br />
    <button type="submit">submit</button>
    <button type="button" id="cancel-btn">Cancel</button>
  </form>
</dialog>
`;
const taslist = document.getElementById("taslist");
const addTodoBtn = document.getElementById("add-todo");
const todoDialog = document.getElementById("todo-dialog");
const cancelBtn = document.getElementById("cancel-btn");

const TaskData = JSON.parse(localStorage.getItem("TaskData")) || [];

const renderTodo = () => {
  taslist.innerHTML = "";
  TaskData.forEach((todo, index) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-item");
    todoDiv.innerHTML = `
      <h2 id=${index}>${todo.title}</h2>
      <p>${todo.description}</p>
      <p>Due Date: ${todo.dueDate}</p>
      <p>Priority: ${todo.priority}</p>
    `;
    taslist.appendChild(todoDiv);
  });
};

addTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
});

cancelBtn.addEventListener("click", () => {
  todoDialog.close();
});

todoDialog.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTodo = new Todo(
    document.getElementById("title").value,
    document.getElementById("description").value,
    document.getElementById("dueDate").value,
    document.getElementById("priority").value
  );
  TaskData.push(newTodo);
  localStorage.setItem("TaskData", JSON.stringify(TaskData));
  renderTodo();
  todoDialog.close();
  todoDialog.querySelector("form").reset();
});

renderTodo();
