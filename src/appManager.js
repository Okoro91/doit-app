// appManager.js

import Todo from "./todo.js";
import Project from "./project.js";

class AppManager {
  constructor() {
    this.projects = [];
    this.todos = new Map();
    this.currentProjectId = null;
    this.loadFromStorage();

    if (this.projects.length === 0) {
      this.createDefaultProject();
    }
  }

  createProject(name, description = "", color = "#3B82F6") {
    const project = new Project(name, description, color);
    this.projects.push(project);

    if (this.projects.length === 1) {
      project.isDefault = true;
      this.currentProjectId = project.id;
    }

    this.saveToStorage();
    return project;
  }

  createDefaultProject() {
    const inbox = new Project(
      "Inbox",
      "Your default project for all todos",
      "#3B82F6"
    );
    inbox.isDefault = true;
    this.projects.push(inbox);
    this.currentProjectId = inbox.id;
    this.saveToStorage();
    return inbox;
  }

  getProject(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }

  getCurrentProject() {
    return this.getProject(this.currentProjectId);
  }

  setCurrentProject(projectId) {
    if (this.getProject(projectId)) {
      this.currentProjectId = projectId;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  updateProject(projectId, updates) {
    const project = this.getProject(projectId);
    if (project) {
      if (updates.isDefault !== undefined) {
        delete updates.isDefault;
      }

      Object.assign(project, updates);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteProject(projectId) {
    const project = this.getProject(projectId);
    if (!project || project.isDefault) return false;

    project.todoIds.forEach((todoId) => {
      this.deleteTodo(todoId);
    });

    const index = this.projects.findIndex((p) => p.id === projectId);
    if (index > -1) {
      this.projects.splice(index, 1);

      if (this.currentProjectId === projectId) {
        const defaultProject = this.projects.find((p) => p.isDefault);
        this.currentProjectId = defaultProject.id;
      }

      this.saveToStorage();
      return true;
    }
    return false;
  }

  createTodo(title, description, dueDate, priority, projectId = null) {
    const todo = new Todo(title, description, dueDate, priority);
    this.todos.set(todo.id, todo);

    const project = projectId
      ? this.getProject(projectId)
      : this.getCurrentProject();
    if (project) {
      project.addTodo(todo.id);
    }

    this.saveToStorage();
    return todo;
  }

  getTodo(todoId) {
    return this.todos.get(todoId);
  }

  updateTodo(todoId, updates) {
    const todo = this.getTodo(todoId);
    if (todo) {
      Object.assign(todo, updates);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteTodo(todoId) {
    this.projects.forEach((project) => {
      project.removeTodo(todoId);
    });

    this.todos.delete(todoId);
    this.saveToStorage();
    return true;
  }

  moveTodo(todoId, fromProjectId, toProjectId) {
    const fromProject = this.getProject(fromProjectId);
    const toProject = this.getProject(toProjectId);
    const todo = this.getTodo(todoId);

    if (fromProject && toProject && todo) {
      fromProject.removeTodo(todoId);
      toProject.addTodo(todoId);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  searchTodos(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const todo of this.todos.values()) {
      if (
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm) ||
        todo.notes.toLowerCase().includes(searchTerm) ||
        todo.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push(todo);
      }
    }

    return results;
  }

  getAllTags() {
    const tags = new Set();
    for (const todo of this.todos.values()) {
      todo.tags.forEach((tag) => tags.add(tag));
    }
    return Array.from(tags);
  }

  getTodosByTag(tag) {
    const todosWithTag = [];
    for (const todo of this.todos.values()) {
      if (todo.tags.includes(tag)) {
        todosWithTag.push(todo);
      }
    }
    return todosWithTag;
  }

  getStats() {
    let totalTodos = 0;
    let completedTodos = 0;
    let overdueTodos = 0;
    const priorityCounts = { low: 0, medium: 0, high: 0, critical: 0 };

    for (const todo of this.todos.values()) {
      totalTodos++;
      if (todo.completed) {
        completedTodos++;
      }
      if (todo.isOverdue) {
        overdueTodos++;
      }
      priorityCounts[todo.priority]++;
    }

    return {
      totalTodos,
      completedTodos,
      overdueTodos,
      activeTodos: totalTodos - completedTodos,
      completionRate: totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0,
      priorityCounts,
      totalProjects: this.projects.length,
    };
  }

  // Storage
  saveToStorage() {
    try {
      const data = {
        projects: this.projects.map((p) => p.toJSON()),
        todos: Array.from(this.todos.values()).map((t) => t.toJSON()),
        currentProjectId: this.currentProjectId,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem("todoAppData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem("todoAppData");
      if (!data) return;

      const parsed = JSON.parse(data);

      if (parsed.projects) {
        this.projects = parsed.projects.map((p) => Project.fromJSON(p));
      }

      if (parsed.todos) {
        this.todos.clear();
        parsed.todos.forEach((todoData) => {
          const todo = Todo.fromJSON(todoData);
          this.todos.set(todo.id, todo);
        });
      }

      if (parsed.currentProjectId) {
        this.currentProjectId = parsed.currentProjectId;
      }

      if (!this.currentProjectId && this.projects.length > 0) {
        const defaultProject =
          this.projects.find((p) => p.isDefault) || this.projects[0];
        this.currentProjectId = defaultProject.id;
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      localStorage.removeItem("todoAppData");
    }
  }

  clearStorage() {
    localStorage.removeItem("todoAppData");
    this.projects = [];
    this.todos.clear();
    this.createDefaultProject();
  }

  exportData() {
    const data = {
      projects: this.projects.map((p) => p.toJSON()),
      todos: Array.from(this.todos.values()).map((t) => t.toJSON()),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (data.projects && data.todos) {
        this.projects = [];
        this.todos.clear();

        this.projects = data.projects.map((p) => Project.fromJSON(p));

        data.todos.forEach((todoData) => {
          const todo = Todo.fromJSON(todoData);
          this.todos.set(todo.id, todo);
        });

        const defaultProject =
          this.projects.find((p) => p.isDefault) || this.projects[0];
        this.currentProjectId = defaultProject.id;

        this.saveToStorage();
        return true;
      }
    } catch (error) {
      console.error("Failed to import data:", error);
    }
    return false;
  }
}

export default new AppManager();
