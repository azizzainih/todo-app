// import React from 'react';
// import { Plus, X } from 'lucide-react';
// import { Droppable, Draggable } from 'react-beautiful-dnd';

// const TodoList = ({ dateKey, todos, onAddTodo, onUpdateTodo, onToggleTodo, onRemoveTodo }) => {
//   const calculateProgress = () => {
//     if (!todos?.[dateKey]?.length) return 0;
//     const completed = todos[dateKey].filter(todo => todo.checked).length;
//     return Math.round((completed / todos[dateKey].length) * 100);
//   };

//   // Ensure dateKey is valid and todos exist for that date
//   if (!dateKey || !todos || !todos[dateKey]) {
//     return (
//       <div className="todo-list">
//         <button onClick={() => onAddTodo(dateKey)} className="add-todo-btn">
//           <Plus className="w-4 h-4" /> Add Todo
//         </button>
//         <div className="todo-items">No todos for this date</div>
//       </div>
//     );
//   }

//   return (
//     <div className="todo-list">
//       <button onClick={() => onAddTodo(dateKey)} className="add-todo-btn">
//         <Plus className="w-4 h-4" /> Add Todo
//       </button>
//       <div className="progress-container">
//         <div className="progress-bar">
//           <div 
//             className="progress-fill" 
//             style={{ width: `${calculateProgress()}%` }}
//           />
//         </div>
//         <span className="progress-text">{calculateProgress()}%</span>
//       </div>
//       <Droppable droppableId={String(dateKey)}>
//         {(provided) => (
//           <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             className="todo-items"
//           >
//             {todos[dateKey]?.map((todo, index) => (
//               <Draggable
//                 key={todo.id}
//                 draggableId={String(todo.id)}
//                 index={index}
//               >
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     className={`todo-item ${snapshot.isDragging ? 'dragging' : ''} ${
//                       todo.checked ? 'completed' : ''
//                     }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={todo.checked}
//                       onChange={() => onToggleTodo(dateKey, todo.id)}
//                       className="todo-checkbox"
//                     />
//                     <input
//                       type="text"
//                       defaultValue={todo.task}
//                       onBlur={(e) => onUpdateTodo(dateKey, todo.id, e.target.value)}
//                       className="todo-input"
//                     />
//                     <button
//                       onClick={() => onRemoveTodo(dateKey, todo.id)}
//                       className="remove-todo-btn"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </div>
//   );
// };

// export default TodoList;
// TodoList.js
import React, { useState } from 'react';
import { Plus, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TodoItem = ({ todo, dateKey, level = 0, onToggleTodo, onUpdateTodo, onRemoveTodo, onAddSubtask, provided, snapshot }) => {
  const [expanded, setExpanded] = useState(true);
  
  const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
  const allSubtasksChecked = hasSubtasks && 
    todo.subtasks.every(subtask => subtask.checked);
  
  const toggleExpanded = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const renderSubtasks = (subtasks) => {
    return subtasks.map((subtask) => (
      <TodoItem
        key={subtask.id}
        todo={subtask}
        dateKey={dateKey}
        level={level + 1}
        onToggleTodo={onToggleTodo}
        onUpdateTodo={onUpdateTodo}
        onRemoveTodo={onRemoveTodo}
        onAddSubtask={onAddSubtask}
      />
    ));
  };

  // Ensure we're passing the draggable props correctly
  const draggableProps = provided ? {
    ref: provided.innerRef,
    ...provided.draggableProps,
    ...provided.dragHandleProps,
  } : {};

  return (
    <div
      {...draggableProps}
      className={`todo-item ${snapshot?.isDragging ? 'dragging' : ''} ${
        todo.checked ? 'completed' : ''
      }`}
      style={{ 
        marginLeft: `${level * 1.5}rem`,
        ...provided?.draggableProps?.style
      }}
    >
      <div className="todo-content">
        {hasSubtasks && (
          <button onClick={toggleExpanded} className="expand-btn">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        <input
          type="checkbox"
          checked={todo.checked || allSubtasksChecked}
          onChange={() => onToggleTodo(dateKey, todo.id, level)}
          className="todo-checkbox"
        />
        <input
          type="text"
          defaultValue={todo.task}
          onBlur={(e) => onUpdateTodo(dateKey, todo.id, e.target.value, level)}
          className="todo-input"
        />
        <button
          onClick={() => onAddSubtask(dateKey, todo.id)}
          className="add-subtask-btn"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          onClick={() => onRemoveTodo(dateKey, todo.id, level)}
          className="remove-todo-btn"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {hasSubtasks && expanded && (
        <div className="subtasks">
          {renderSubtasks(todo.subtasks)}
        </div>
      )}
    </div>
  );
};

const TodoList = ({ dateKey, todos, onAddTodo, onUpdateTodo, onToggleTodo, onRemoveTodo, onAddSubtask }) => {
  const calculateProgress = () => {
    if (!todos[dateKey]?.length) return 0;
    
    const countCheckedTasks = (tasks) => {
      return tasks.reduce((acc, task) => {
        let count = task.checked ? 1 : 0;
        if (task.subtasks?.length) {
          count += countCheckedTasks(task.subtasks);
        }
        return acc + count;
      }, 0);
    };

    const countTotalTasks = (tasks) => {
      return tasks.reduce((acc, task) => {
        let count = 1;
        if (task.subtasks?.length) {
          count += countTotalTasks(task.subtasks);
        }
        return acc + count;
      }, 0);
    };

    const checked = countCheckedTasks(todos[dateKey]);
    const total = countTotalTasks(todos[dateKey]);
    return Math.round((checked / total) * 100);
  };
  
  // Ensure we have a valid array of todos
  const todosForDate = todos[dateKey] || [];

  // Don't render the Droppable until todos are loaded
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
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        <span className="progress-text">{calculateProgress()}%</span>
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
                draggableId={String(todo.id)} // Ensure ID is a string
                index={index}
              >
                {(provided, snapshot) => (
                  <TodoItem
                    todo={todo}
                    dateKey={dateKey}
                    onToggleTodo={onToggleTodo}
                    onUpdateTodo={onUpdateTodo}
                    onRemoveTodo={onRemoveTodo}
                    onAddSubtask={onAddSubtask}
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