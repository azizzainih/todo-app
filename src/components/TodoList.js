import React from 'react';
import { Plus, X } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TodoItem = ({ 
  todo, 
  dateKey, 
  onToggleTodo, 
  onUpdateTodo, 
  onRemoveTodo, 
  provided, 
  snapshot
}) => {
  
  const draggableProps = provided ? {
    ref: provided.innerRef,
    ...provided.draggableProps,
    ...provided.dragHandleProps,
  } : {};

  return (
    <div
      {...draggableProps}
      className={`todo-item ${snapshot?.isDragging ? 'dragging' : ''} ${todo.checked ? 'completed' : ''}`}
      style={{
        ...provided?.draggableProps?.style
      }}
    >
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={() => onToggleTodo(dateKey, todo.id)}
          className="todo-checkbox"
        />
        <input
          type="text"
          defaultValue={todo.task}
          onBlur={(e) => onUpdateTodo(dateKey, todo.id, e.target.value)}
          className="todo-input"
        />
        <button
          onClick={() => onRemoveTodo(dateKey, todo.id)}
          className="remove-todo-btn"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TodoList = ({ 
  dateKey, 
  todos, 
  onAddTodo, 
  onUpdateTodo, 
  onToggleTodo, 
  onRemoveTodo
}) => {
  const calculateProgress = () => {
    if (!todos[dateKey]?.length) return 0;
    
    const checked = todos[dateKey].filter(task => task.checked).length;
    const total = todos[dateKey].length;
    return Math.round((checked / total) * 100);
  };
  
  const todosForDate = todos[dateKey] || [];

  if (!todos || Object.keys(todos).length === 0) {
    return (
      <div className="todo-list">
        <button onClick={() => onAddTodo(dateKey)} className="add-todo-btn">
          <Plus className="w-4 h-4" /> Add Todo
        </button>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "0%" }} />
          </div>
          <span className="progress-text">0%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <button onClick={() => onAddTodo(dateKey)} className="add-todo-btn">
        <Plus className="w-4 h-4" /> Add Todo
      </button>
      <div className="task-progress-container">
        <div className="task-progress-bar">
          <div 
            className="task-progress-fill" 
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        <span className="task-progress-text">{calculateProgress()}%</span>
      </div>
      <Droppable droppableId={dateKey}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="todo-items"
          >
            {todosForDate.map((todo, index) => (
              <Draggable
                key={todo.id}
                draggableId={String(todo.id)}
                index={index}
              >
                {(provided, snapshot) => (
                  <TodoItem
                    todo={todo}
                    dateKey={dateKey}
                    onToggleTodo={onToggleTodo}
                    onUpdateTodo={onUpdateTodo}
                    onRemoveTodo={onRemoveTodo}
                    provided={provided}
                    snapshot={snapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;