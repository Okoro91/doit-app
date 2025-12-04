import AppManager from "./appManager.js";
import DateUtils from "./dateUtils.js";
import "./styles.css";
import page from "./page.js";

class UI {
  constructor() {
    this.app = AppManager;
    this.currentFilter = "all";
    this.elements = {};
    this.init();
  }

  init() {
    page();

    this.initializeElements();

    this.renderProjects();
    this.renderTodos();
    this.updateStats();
    this.bindEvents();
  }

  initializeElements() {
    this.elements = {
      projectsList: document.getElementById("projects-list"),
      tagsList: document.getElementById("tags-list"),

      allCount: document.getElementById("all-count"),
      todayCount: document.getElementById("today-count"),
      weekCount: document.getElementById("week-count"),
      overdueCount: document.getElementById("overdue-count"),

      currentProjectName: document.getElementById("current-project-name"),
      currentProjectDescription: document.getElementById(
        "current-project-description"
      ),

      statTotal: document.getElementById("stat-total"),
      statCompleted: document.getElementById("stat-completed"),
      statActive: document.getElementById("stat-active"),
      statOverdue: document.getElementById("stat-overdue"),
      projectTodoCount: document.getElementById("project-todo-count"),

      todosContainer: document.getElementById("todos-container"),
      sortSelect: document.getElementById("sort-select"),
      filterSelect: document.getElementById("filter-select"),

      newProjectBtn: document.getElementById("new-project-btn"),
      newTodoBtn: document.getElementById("new-todo-btn"),

      todoModal: document.getElementById("todo-modal"),
      projectModal: document.getElementById("project-modal"),
      todoForm: document.getElementById("todo-form"),
      projectForm: document.getElementById("project-form"),
      todoProjectSelect: document.getElementById("todo-project"),
    };

    this.elements.todoTitle = document.getElementById("todo-title");
    this.elements.todoDescription = document.getElementById("todo-description");
    this.elements.todoDueDate = document.getElementById("todo-due-date");
    this.elements.todoPriority = document.getElementById("todo-priority");
    this.elements.todoTags = document.getElementById("todo-tags");
    this.elements.todoNotes = document.getElementById("todo-notes");

    this.elements.projectName = document.getElementById("project-name");
    this.elements.projectDescription = document.getElementById(
      "project-description"
    );

    this.elements.projectColor = document.getElementById("project-color");

    this.elements.saveTodo = document.getElementById("save-todo");
    this.elements.cancelTodo = document.getElementById("cancel-todo");
    this.elements.saveProject = document.getElementById("save-project");
    this.elements.cancelProject = document.getElementById("cancel-project");
    this.elements.closeTodoModal = document.getElementById("close-todo-modal");
    this.elements.closeProjectModal = document.getElementById(
      "close-project-modal"
    );
  }

  bindEvents() {
    this.elements.newTodoBtn.addEventListener("click", () =>
      this.showTodoModal()
    );
    this.elements.newProjectBtn.addEventListener("click", () =>
      this.showProjectModal()
    );

    this.elements.closeTodoModal.addEventListener("click", () =>
      this.hideTodoModal()
    );
    this.elements.closeProjectModal.addEventListener("click", () =>
      this.hideProjectModal()
    );
    this.elements.cancelTodo.addEventListener("click", () =>
      this.hideTodoModal()
    );
    this.elements.cancelProject.addEventListener("click", () =>
      this.hideProjectModal()
    );

    this.elements.todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleTodoSubmit();
    });

    this.elements.projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleProjectSubmit();
    });

    this.elements.sortSelect.addEventListener("change", (e) => {
      const [sortBy, direction] = e.target.value.split("-");
      const project = this.app.getCurrentProject();
      if (project) {
        project.updateSort(sortBy, direction);
        this.renderTodos();
      }
    });

    this.elements.filterSelect.addEventListener("change", (e) => {
      const project = this.app.getCurrentProject();
      if (project) {
        project.updateFilter("completed", e.target.value);
        this.renderTodos();
      }
    });

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const filter = e.currentTarget.dataset.filter;
        this.handleFilterClick(filter);
      });
    });

    this.elements.todoModal.addEventListener("click", (e) => {
      if (e.target === this.elements.todoModal) {
        this.hideTodoModal();
      }
    });

    this.elements.projectModal.addEventListener("click", (e) => {
      if (e.target === this.elements.projectModal) {
        this.hideProjectModal();
      }
    });
  }

  renderProjects() {
    const projects = this.app.projects;
    this.elements.projectsList.innerHTML = "";

    projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.className = `nav-item ${
        project.id === this.app.currentProjectId ? "active" : ""
      }`;
      projectElement.innerHTML = `
        <i class="fas fa-folder" style="color: ${project.color}"></i>
        <span>${project.name}</span>
        <div class="todo-actions">
          <button class="action-btn edit-project" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-project" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
         </div>
         <span class="badge">${project.getTodoCount()}</span>
      `;

      projectElement.addEventListener("click", () => {
        this.app.setCurrentProject(project.id);
        this.updateCurrentProject();
        this.renderProjects();
        this.renderTodos();
        this.updateStats();
      });

      const editBtn = projectElement.querySelector(".edit-project");
      editBtn.addEventListener("click", () => {
        this.showProjectModal(project);
      });

      const deleteBtn = projectElement.querySelector(".delete-project");
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this task?")) {
          this.app.deleteProject(project.id);
          this.renderTodos();
          this.updateStats();
          this.renderProjects();
        }
      });

      this.elements.projectsList.appendChild(projectElement);
    });

    this.updateProjectSelect();
  }

  updateProjectSelect() {
    const projects = this.app.projects;
    this.elements.todoProjectSelect.innerHTML = "";

    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      if (project.id === this.app.currentProjectId) {
        option.selected = true;
      }
      this.elements.todoProjectSelect.appendChild(option);
    });
  }

  updateCurrentProject() {
    const project = this.app.getCurrentProject();
    if (project) {
      this.elements.currentProjectName.textContent = project.name;
      this.elements.currentProjectDescription.textContent = project.description;
      this.elements.projectTodoCount.textContent = project.getTodoCount();
    }
  }

  renderTodos() {
    const project = this.app.getCurrentProject();
    if (!project) return;

    const todos = project.getFilteredTodos(this.app);
    this.elements.todosContainer.innerHTML = "";

    if (todos.length === 0) {
      this.elements.todosContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <h3>No tasks yet</h3>
          <p>Click "New Task" to add your first task to this project</p>
        </div>
      `;
      return;
    }

    todos.forEach((todo) => {
      const todoElement = this.createTodoElement(todo);
      this.elements.todosContainer.appendChild(todoElement);
    });
  }

  createTodoElement(todo) {
    const element = document.createElement("div");
    element.className = "todo-item";
    element.dataset.todoId = todo.id;

    const priorityClass = `priority-${todo.priority}`;
    const dueStatus = DateUtils.getDueStatus(todo.dueDate);

    element.innerHTML = `
      <div class="todo-checkbox ${todo.completed ? "checked" : ""}">
        ${todo.completed ? '<i class="fas fa-check"></i>' : ""}
      </div>
      <div class="todo-content">
        <div class="todo-title ${todo.completed ? "completed" : ""}">${
      todo.title
    }</div>
        <div class="todo-meta">
          <span class="priority-badge ${priorityClass}">${todo.priority}</span>
          <span><i class="far fa-calendar"></i> ${DateUtils.formatRelativeDate(
            todo.dueDate
          )}</span>
          ${todo.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
        </div>
      </div>
      <div class="todo-actions">
        <button class="action-btn edit-todo" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-todo" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    const checkbox = element.querySelector(".todo-checkbox");
    checkbox.addEventListener("click", () => {
      todo.toggleComplete();
      this.app.saveToStorage();
      this.renderTodos();
      this.updateStats();
    });

    const editBtn = element.querySelector(".edit-todo");
    editBtn.addEventListener("click", () => {
      this.showTodoModal(todo);
    });

    const deleteBtn = element.querySelector(".delete-todo");
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?")) {
        this.app.deleteTodo(todo.id);
        this.renderTodos();
        this.updateStats();
        this.renderProjects();
      }
    });

    element.addEventListener("click", (e) => {
      if (
        !e.target.closest(".todo-checkbox") &&
        !e.target.closest(".edit-todo") &&
        !e.target.closest(".delete-todo")
      ) {
        this.showTodoDetail(todo);
      }
    });

    return element;
  }

  showTodoModal(todo = null) {
    this.editingTodo = todo;

    if (todo) {
      document.querySelector("#todo-modal .modal-header h2").textContent =
        "Edit Task";
      this.elements.saveTodo.textContent = "Update Task";

      this.elements.todoTitle.value = todo.title;
      this.elements.todoDescription.value = todo.description;
      this.elements.todoDueDate.value = this.formatDateTimeForInput(
        todo.dueDate
      );
      this.elements.todoPriority.value = todo.priority;
      this.elements.todoNotes.value = todo.notes || "";
      this.elements.todoTags.value = todo.tags.join(", ");

      const project = this.app.projects.find((p) =>
        p.todoIds.includes(todo.id)
      );
      if (project) {
        this.elements.todoProjectSelect.value = project.id;
      }
    } else {
      document.querySelector("#todo-modal .modal-header h2").textContent =
        "New Task";
      this.elements.saveTodo.textContent = "Save Task";

      this.elements.todoForm.reset();
      this.elements.todoDueDate.value = this.formatDateTimeForInput(
        new Date(Date.now() + 86400000)
      );
      this.elements.todoPriority.value = "medium";
      this.elements.todoProjectSelect.value = this.app.currentProjectId;
    }

    this.elements.todoModal.classList.add("active");
    this.elements.todoTitle.focus();
  }

  hideTodoModal() {
    this.elements.todoModal.classList.remove("active");
    this.elements.todoForm.reset();
    this.editingTodo = null;
  }

  showProjectModal(project = null) {
    this.editingProject = project;

    if (project) {
      document.querySelector("#project-modal .modal-header h2").textContent =
        "Edit Project";
      this.elements.saveProject.textContent = "Update Project";

      this.elements.projectName.value = project.name;
      this.elements.projectDescription.value = project.description;
      this.elements.projectColor.value = project.color;
    } else {
      document.querySelector("#project-modal .modal-header h2").textContent =
        "New Project";
      this.elements.saveProject.textContent = "Save Project";

      this.elements.projectForm.reset();
      this.elements.projectColor.value = "#3B82F6";
    }

    this.elements.projectModal.classList.add("active");
    this.elements.projectName.focus();
  }

  hideProjectModal() {
    this.elements.projectModal.classList.remove("active");
    this.elements.projectForm.reset();
    this.elements.projectColor.value = "#3B82F6";
    this.editingProject = null;
  }

  handleTodoSubmit() {
    const title = this.elements.todoTitle.value.trim();
    const description = this.elements.todoDescription.value.trim();
    const dueDate = this.elements.todoDueDate.value;
    const priority = this.elements.todoPriority.value;
    const projectId = this.elements.todoProjectSelect.value;
    const notes = this.elements.todoNotes.value.trim();
    const tags = this.elements.todoTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    if (!title) {
      alert("Title is required");
      return;
    }

    if (this.editingTodo) {
      this.app.updateTodo(this.editingTodo.id, {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        notes,
        tags,
      });

      const currentProject = this.app.projects.find((p) =>
        p.todoIds.includes(this.editingTodo.id)
      );
      if (currentProject && currentProject.id !== projectId) {
        this.app.moveTodo(this.editingTodo.id, currentProject.id, projectId);
      }
    } else {
      this.app.createTodo(title, description, dueDate, priority, projectId);

      const newTodo = Array.from(this.app.todos.values()).pop();
      if (newTodo) {
        this.app.updateTodo(newTodo.id, { notes, tags });
      }
    }

    this.hideTodoModal();
    this.renderTodos();
    this.renderProjects();
    this.updateStats();
  }

  handleProjectSubmit() {
    const name = this.elements.projectName.value.trim();
    const description = this.elements.projectDescription.value.trim();
    const color = this.elements.projectColor.value;

    if (!name) {
      alert("Project name is required");
      return;
    }

    if (this.editingProject) {
      this.app.updateProject(this.editingProject.id, {
        name,
        description,
        color,
      });
    } else {
      this.app.createProject(name, description, color);
    }

    this.hideProjectModal();
    this.renderProjects();
    this.updateStats();
  }

  updateStats() {
    const stats = this.app.getStats();

    this.elements.allCount.textContent = stats.totalTodos;
    this.elements.statTotal.textContent = stats.totalTodos;
    this.elements.statCompleted.textContent = stats.completedTodos;
    this.elements.statActive.textContent = stats.activeTodos;
    this.elements.statOverdue.textContent = stats.overdueTodos;

    const today = new Date().toDateString();
    const todayCount = Array.from(this.app.todos.values()).filter((todo) => {
      return !todo.completed && todo.dueDate.toDateString() === today;
    }).length;

    const weekCount = Array.from(this.app.todos.values()).filter((todo) => {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return (
        !todo.completed &&
        todo.dueDate <= weekFromNow &&
        todo.dueDate >= new Date()
      );
    }).length;

    this.elements.todayCount.textContent = todayCount;
    this.elements.weekCount.textContent = weekCount;
    this.elements.overdueCount.textContent = stats.overdueTodos;

    const project = this.app.getCurrentProject();
    if (project) {
      this.elements.projectTodoCount.textContent = project.getTodoCount();
    }
  }

  formatDateTimeForInput(date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  handleFilterClick(filter) {
    this.currentFilter = filter;

    document.querySelectorAll("[data-filter]").forEach((el) => {
      el.classList.toggle("active", el.dataset.filter === filter);
    });

    const project = this.app.getCurrentProject();
    if (project) {
      switch (filter) {
        case "today":
          project.updateFilter("dueDate", "today");
          break;
        case "week":
          project.updateFilter("dueDate", "week");
          break;
        case "overdue":
          project.updateFilter("dueDate", "overdue");
          break;
        default:
          project.updateFilter("dueDate", "all");
      }

      this.renderTodos();
    }
  }

  showTodoDetail(todo) {
    alert(
      `Todo Details:\n\nTitle: ${todo.title}\nDescription: ${
        todo.description
      }\nDue: ${DateUtils.formatDate(todo.dueDate)}\nPriority: ${
        todo.priority
      }\nStatus: ${todo.completed ? "Completed" : "Active"}`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();

  window.appUI = ui;
  window.appManager = AppManager;
  window.dateUtils = DateUtils;

  console.log("TaskNur initialized!");
  console.log("Available globals: appUI, appManager, dateUtils");
});
