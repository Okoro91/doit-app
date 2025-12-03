// Todo.js
export default class Todo {
  constructor(title, description, dueDate, priority, checklist = []) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.checklist = checklist; // optional array of subtasks
    this.isDone = false; // track completion status
    this.createdAt = new Date(); // timestamp when created
  }

  toggleCompletion() {
    this.isDone = !this.isDone;
  }
}
