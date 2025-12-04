const page = () => {
  const content = document.getElementById("content");

  content.innerHTML = `
    <aside class="sidebar">
      <div class="logo">
        <i class="fas fa-check-circle logo-icon"></i>
        <span class="logo-text">TaskNur</span>
      </div>
      
      <div class="nav-section">
        <div class="nav-title">Projects</div>
        <div id="projects-list"></div>
      </div>
      
      <div class="nav-section">
        <div class="nav-title">Filters</div>
        <div class="nav-item" data-filter="all">
          <i class="fas fa-inbox"></i>
          <span>All Tasks</span>
          <span class="badge" id="all-count">0</span>
        </div>
        <div class="nav-item" data-filter="today">
          <i class="fas fa-calendar-day"></i>
          <span>Today</span>
          <span class="badge" id="today-count">0</span>
        </div>
        <div class="nav-item" data-filter="week">
          <i class="fas fa-calendar-week"></i>
          <span>This Week</span>
          <span class="badge" id="week-count">0</span>
        </div>
        <div class="nav-item" data-filter="overdue">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Overdue</span>
          <span class="badge" id="overdue-count">0</span>
        </div>
      </div>
      
      <div class="nav-section">
        <div class="nav-title">Tags</div>
        <div id="tags-list"></div>
      </div>
      
      <div class="nav-section" style="margin-top: auto; padding-bottom: 2rem;">
        <button class="btn btn-primary" id="new-project-btn" style="width: 100%;">
          <i class="fas fa-plus"></i>
          New Project
        </button>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <div>
          <h1 class="page-title" id="current-project-name">Inbox</h1>
          <div class="project-description" id="current-project-description" style="color: var(--gray-500); font-size: 0.875rem; margin-top: 0.25rem;">
            Your default project for all todos
          </div>
        </div>
        <div class="quick-actions">
          <button class="btn btn-secondary" id="search-btn">
            <i class="fas fa-search"></i>
            Search
          </button>
          <button class="btn btn-primary" id="new-todo-btn">
            <i class="fas fa-plus"></i>
            New Task
          </button>
        </div>
      </header>
      
      

      <section class="content-area">
        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon primary">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-info">
              <h3>Total Tasks</h3>
              <div class="stat-value" id="stat-total">0</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon success">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
              <h3>Completed</h3>
              <div class="stat-value" id="stat-completed">0</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon warning">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>Active</h3>
              <div class="stat-value" id="stat-active">0</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon danger">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="stat-info">
              <h3>Overdue</h3>
              <div class="stat-value" id="stat-overdue">0</div>
            </div>
          </div>
        </div>
        
        <!-- Todo List -->
        <div class="todo-list">
          <div class="todo-header">
            <div style="font-weight: 600; color: var(--gray-700);">
              Tasks (<span id="project-todo-count">0</span>)
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <select class="form-input" style="width: auto; padding: 0.25rem 0.5rem;" id="sort-select">
                <option value="dueDate-asc">Due Date (Ascending)</option>
                <option value="dueDate-desc">Due Date (Descending)</option>
                <option value="priority-desc">Priority (High to Low)</option>
                <option value="priority-asc">Priority (Low to High)</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              <select class="form-input" style="width: auto; padding: 0.25rem 0.5rem;" id="filter-select">
                <option value="all">All Tasks</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>
          </div>
          <div id="todos-container"></div>
        </div>
      </section>
      <p>
        design & code by:
        <a href="https://okoro91.github.io/portfolio/">mi okoro</a>
      </p>
    </main>
    

    <div class="modal-overlay" id="todo-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 style="font-size: 1.25rem; font-weight: 600;">New Task</h2>
          <button class="action-btn" id="close-todo-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="todo-form">
            <div class="form-group">
              <label class="form-label" for="todo-title">Title</label>
              <input type="text" class="form-input" id="todo-title" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="todo-description">Description</label>
              <textarea class="form-input" id="todo-description" rows="3"></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="todo-due-date">Due Date</label>
                <input type="datetime-local" class="form-input" id="todo-due-date">
              </div>
              <div class="form-group">
                <label class="form-label" for="todo-priority">Priority</label>
                <select class="form-input" id="todo-priority">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="todo-project">Project</label>
              <select class="form-input" id="todo-project"></select>
            </div>
            <div class="form-group">
              <label class="form-label" for="todo-tags">Tags (comma separated)</label>
              <input type="text" class="form-input" id="todo-tags" placeholder="work, personal, urgent">
            </div>
            <div class="form-group">
              <label class="form-label" for="todo-notes">Notes</label>
              <textarea class="form-input" id="todo-notes" rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-todo">Cancel</button>
          <button type="submit" form="todo-form" class="btn btn-primary" id="save-todo">Save Task</button>
        </div>
      </div>
    </div>
    
    <div class="modal-overlay" id="project-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 style="font-size: 1.25rem; font-weight: 600;">New Project</h2>
          <button class="action-btn" id="close-project-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="project-form">
            <div class="form-group">
              <label class="form-label" for="project-name">Project Name</label>
              <input type="text" class="form-input" id="project-name" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="project-description">Description</label>
              <textarea class="form-input" id="project-description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="project-color">Color</label>
              <input type="color" class="form-input" id="project-color" value="#3B82F6" style="height: 40px; width: 60px; padding: 0.25rem;">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-project">Cancel</button>
          <button type="submit" form="project-form" class="btn btn-primary" id="save-project">Create Project</button>
        </div>
      </div>
    </div>
    `;
};

export default page;
