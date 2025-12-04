export default class Project {
  constructor(name, description = "", color = "#3B82F6") {
    this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    this.name = name;
    this.description = description;
    this.color = color;
    this.createdAt = new Date();
    this.todoIds = []; // Store references to todo IDs
    this.isDefault = false;
    this.view = "list"; // 'list', 'board', 'calendar'
    this.sortBy = "dueDate"; // 'dueDate', 'priority', 'createdAt', 'title'
    this.sortDirection = "asc"; // 'asc', 'desc'
    this.filters = {
      completed: "all", // 'all', 'active', 'completed'
      priority: "all", // 'all', 'low', 'medium', 'high', 'critical'
      dueDate: "all", // 'all', 'today', 'week', 'overdue'
      tags: [],
    };
  }

  addTodo(todoId) {
    if (!this.todoIds.includes(todoId)) {
      this.todoIds.push(todoId);
      return true;
    }
    return false;
  }

  removeTodo(todoId) {
    const index = this.todoIds.indexOf(todoId);
    if (index > -1) {
      this.todoIds.splice(index, 1);
      return true;
    }
    return false;
  }

  getTodoCount() {
    return this.todoIds.length;
  }

  getCompletedCount(todoManager) {
    return this.todoIds.filter((id) => {
      const todo = todoManager.getTodo(id);
      return todo && todo.completed;
    }).length;
  }

  getFilteredTodos(todoManager) {
    let todos = this.todoIds
      .map((id) => todoManager.getTodo(id))
      .filter((todo) => todo !== undefined);

    if (this.filters.completed === "active") {
      todos = todos.filter((todo) => !todo.completed);
    } else if (this.filters.completed === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    if (this.filters.priority !== "all") {
      todos = todos.filter((todo) => todo.priority === this.filters.priority);
    }

    if (this.filters.dueDate !== "all") {
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

      switch (this.filters.dueDate) {
        case "today":
          todos = todos.filter((todo) => {
            return todo.dueDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          todos = todos.filter((todo) => {
            return todo.dueDate >= today && todo.dueDate <= endOfWeek;
          });
          break;
        case "overdue":
          todos = todos.filter((todo) => todo.isOverdue);
          break;
      }
    }

    if (this.filters.tags.length > 0) {
      todos = todos.filter((todo) => {
        return this.filters.tags.some((tag) => todo.tags.includes(tag));
      });
    }

    return this.sortTodos(todos);
  }

  sortTodos(todos) {
    return [...todos].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case "dueDate":
          comparison = a.dueDate - b.dueDate;
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          comparison =
            (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          break;
        case "createdAt":
          comparison = b.createdAt - a.createdAt;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = a.dueDate - b.dueDate;
      }

      return this.sortDirection === "asc" ? comparison : -comparison;
    });
  }

  updateFilter(filterType, value) {
    if (filterType in this.filters) {
      this.filters[filterType] = value;
      return true;
    }
    return false;
  }

  updateSort(sortBy, direction) {
    this.sortBy = sortBy;
    this.sortDirection = direction;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      color: this.color,
      createdAt: this.createdAt.toISOString(),
      todoIds: this.todoIds,
      isDefault: this.isDefault,
      view: this.view,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      filters: this.filters,
    };
  }

  static fromJSON(json) {
    const project = new Project(json.name, json.description, json.color);
    project.id = json.id;
    project.createdAt = new Date(json.createdAt);
    project.todoIds = json.todoIds || [];
    project.isDefault = json.isDefault || false;
    project.view = json.view || "list";
    project.sortBy = json.sortBy || "dueDate";
    project.sortDirection = json.sortDirection || "asc";
    project.filters = json.filters || {
      completed: "all",
      priority: "all",
      dueDate: "all",
      tags: [],
    };
    return project;
  }
}
