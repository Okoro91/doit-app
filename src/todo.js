class Todo {
  constructor(title, description, dueDate, priority) {
    this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority; // 'low', 'medium', 'high'

    this.createdAt = new Date();
    this.completed = false;
    this.completedAt = null;
    this.notes = "";
    this.checklist = [];
    this.tags = [];
    this.estimatedTime = null;
    this.actualTime = 0;
  }

  get isOverdue() {
    return !this.completed && this.dueDate < new Date();
  }

  get daysUntilDue() {
    const today = new Date();
    const due = this.dueDate;
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get urgency() {
    const days = this.daysUntilDue;
    if (days < 0) return "overdue";
    if (days === 0) return "due-today";
    if (days <= 2) return "due-soon";
    return "not-urgent";
  }

  markComplete() {
    this.completed = true;
    this.completedAt = new Date();
  }

  markIncomplete() {
    this.completed = false;
    this.completedAt = null;
  }

  toggleComplete() {
    if (this.completed) {
      this.markIncomplete();
    } else {
      this.markComplete();
    }
  }

  updatePriority(newPriority) {
    const validPriorities = ["low", "medium", "high", "critical"];
    if (validPriorities.includes(newPriority)) {
      this.priority = newPriority;
      return true;
    }
    return false;
  }

  updateDueDate(newDueDate) {
    const date = new Date(newDueDate);
    if (!isNaN(date.getTime())) {
      this.dueDate = date;
      return true;
    }
    return false;
  }

  addChecklistItem(text, completed = false) {
    const checklistItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      text: text,
      completed: completed,
      createdAt: new Date(),
    };
    this.checklist.push(checklistItem);
    return checklistItem.id;
  }

  removeChecklistItem(itemId) {
    const index = this.checklist.findIndex((item) => item.id === itemId);
    if (index > -1) {
      this.checklist.splice(index, 1);
      return true;
    }
    return false;
  }

  toggleChecklistItem(itemId) {
    const item = this.checklist.find((item) => item.id === itemId);
    if (item) {
      item.completed = !item.completed;
      return true;
    }
    return false;
  }

  get checklistProgress() {
    if (this.checklist.length === 0) return 0;
    const completed = this.checklist.filter((item) => item.completed).length;
    return (completed / this.checklist.length) * 100;
  }

  updateNotes(newNotes) {
    this.notes = newNotes;
  }

  appendNotes(additionalNotes) {
    this.notes += "\n" + additionalNotes;
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      return true;
    }
    return false;
  }

  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      return true;
    }
    return false;
  }

  addTimeSpent(minutes) {
    if (minutes > 0) {
      this.actualTime += minutes;
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate.toISOString(),
      priority: this.priority,
      createdAt: this.createdAt.toISOString(),
      completed: this.completed,
      completedAt: this.completedAt ? this.completedAt.toISOString() : null,
      notes: this.notes,
      checklist: this.checklist,
      tags: this.tags,
      estimatedTime: this.estimatedTime,
      actualTime: this.actualTime,
    };
  }

  static fromJSON(json) {
    const todo = new Todo(
      json.title,
      json.description,
      json.dueDate,
      json.priority
    );

    todo.id = json.id;
    todo.createdAt = new Date(json.createdAt);
    todo.completed = json.completed;
    todo.completedAt = json.completedAt ? new Date(json.completedAt) : null;
    todo.notes = json.notes || "";
    todo.checklist = json.checklist || [];
    todo.tags = json.tags || [];
    todo.estimatedTime = json.estimatedTime || null;
    todo.actualTime = json.actualTime || 0;

    return todo;
  }

  clone() {
    return Todo.fromJSON(this.toJSON());
  }
}

export default Todo;
