import Todo from "./todo";

const content = document.getElementById("content");

content.innerHTML = `
<p>Towards a productive day</p>
<h4>Projects</h4>
<select id="project-select">
  <option value="Default">Default</option>
</select>
<button id="add-project">Add Project</button>
<h4>All Tasks</h4>
<div id="task-list"></div>
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

const projectSelect = document.getElementById("project-select");
const addProjectBtn = document.getElementById("add-project");
const taskList = document.getElementById("task-list");
const addTodoBtn = document.getElementById("add-todo");
const todoDialog = document.getElementById("todo-dialog");
const cancelBtn = document.getElementById("cancel-btn");

const projectData = JSON.parse(localStorage.getItem("projects")) || {
  Default: [],
};

let currentProject = "Default";

const renderProjects = () => {
  projectSelect.innerHTML = "";
  Object.keys(projectData).forEach((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    if (project === currentProject) option.selected = true;
    projectSelect.appendChild(option);
  });
};

const renderTodo = () => {
  taskList.innerHTML = "";
  projectData[currentProject].forEach((todo, index) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-item");
    todoDiv.innerHTML = `
      <h2 id=${index}>${todo.title}</h2>
      <p>${todo.description}</p>
      <p>Due Date: ${todo.dueDate}</p>
      <p>Priority: ${todo.priority}</p>
    `;
    taskList.appendChild(todoDiv);
  });
};

addProjectBtn.addEventListener("click", () => {
  const name = prompt("Enter project name:");
  if (name && !projectData[name]) {
    projectData[name] = [];
    localStorage.setItem("projects", JSON.stringify(projectData));
    currentProject = name;
    renderProjects();
    renderTodo();
  } else if (projectData[name]) {
    alert("Project already exists!");
  }
});

projectSelect.addEventListener("change", (e) => {
  currentProject = e.target.value;
  renderTodo();
});
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
  projectData[currentProject].push(newTodo);
  localStorage.setItem("projects", JSON.stringify(projectData));
  renderTodo();
  todoDialog.close();
  todoDialog.querySelector("form").reset();
});

// renderTodo();
