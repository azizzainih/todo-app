
// import './App.css';
// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';

// const TodoApp = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [todos, setTodos] = useState({});

//   const getTomorrowDate = (date) => {
//     const tomorrow = new Date(date);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow;
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const handlePrevDay = () => {
//     setSelectedDate((prevDate) => {
//       const newDate = new Date(prevDate); // Clone the date
//       newDate.setDate(newDate.getDate() - 1);
//       return newDate;
//     });
//   };
  
//   const handleNextDay = () => {
//     setSelectedDate((prevDate) => {
//       const newDate = new Date(prevDate); // Clone the date
//       newDate.setDate(newDate.getDate() + 1);
//       return newDate;
//     });
//   };
//   const addTodo = (date) => {
//     const dateKey = date.toISOString().split('T')[0];
//     const newTodo = {
//       id: Date.now(),
//       checked: false,
//       task: '',
//     };
//     setTodos((prev) => ({
//       ...prev,
//       [dateKey]: [...(prev[dateKey] || []), newTodo],
//     }));
//   };

//   const updateTodo = (date, todoId, value) => {
//     const dateKey = date.toISOString().split('T')[0];
//     setTodos((prev) => ({
//       ...prev,
//       [dateKey]: prev[dateKey].map((todo) =>
//         todo.id === todoId ? { ...todo, task: value } : todo
//       ),
//     }));
//   };

//   const toggleTodo = (date, todoId) => {
//     const dateKey = date.toISOString().split('T')[0];
//     setTodos((prev) => ({
//       ...prev,
//       [dateKey]: prev[dateKey].map((todo) =>
//         todo.id === todoId ? { ...todo, checked: !todo.checked } : todo
//       ),
//     }));
//   };

//   const removeTodo = (date, todoId) => {
//     const dateKey = date.toISOString().split('T')[0];
//     setTodos((prev) => ({
//       ...prev,
//       [dateKey]: prev[dateKey].filter((todo) => todo.id !== todoId),
//     }));
//   };

//   const TodoList = ({ date }) => {
//     const dateKey = date.toISOString().split('T')[0];
//     const dateTodos = todos[dateKey] || [];
  
//     const completedCount = dateTodos.filter((todo) => todo.checked).length;
//     const totalCount = dateTodos.length;
//     const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
//     return (
//       <div className="todo-list">
//         <div className="progress-container">
//           <div className="progress-bar">
//             <div
//               className="progress-fill"
//               style={{ width: `${progressPercentage}%` }}
//             ></div>
//           </div>
//           <span className="progress-text">
//             {completedCount}/{totalCount} ({progressPercentage}%)
//           </span>
//         </div>
//         <table className="todo-table">
//           <thead>
//             <tr>
//               <th>Done</th>
//               <th>Task</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dateTodos.map((todo) => (
//               <tr key={todo.id} className={todo.checked ? 'completed-row' : ''}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={todo.checked}
//                     onChange={() => toggleTodo(date, todo.id)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     defaultValue={todo.task}
//                     onBlur={(e) => updateTodo(date, todo.id, e.target.value)}
//                     className="todo-input"
//                     placeholder="Enter your task..."
//                   />
//                 </td>
//                 <td>
//                   <button
//                     onClick={() => removeTodo(date, todo.id)}
//                     className="remove-todo-btn"
//                   >
//                     <X size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button onClick={() => addTodo(date)} className="add-todo-btn">
//           <Plus size={16} /> Add Todo
//         </button>
//       </div>
//     );
//   };
  
  

//   const CalendarView = ({ onSelect }) => {
//     const [currentMonth, setCurrentMonth] = useState(new Date());
    
//     const daysInMonth = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth() + 1,
//       0
//     ).getDate();

//     const firstDayOfMonth = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth(),
//       1
//     ).getDay();

//     const handlePrevMonth = () => {
//       setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
//     };

//     const handleNextMonth = () => {
//       setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
//     };

//     const days = [];
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
//     }
    
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//       days.push(
//         <button
//           key={day}
//           onClick={() => {
//             onSelect(date);
//             setShowCalendar(false);
//           }}
//           className="calendar-day"
//         >
//           {day}
//         </button>
//       );
//     }

//     return (
//       <div className="calendar">
//         <div className="calendar-header">
//           <button onClick={handlePrevMonth} className="nav-btn">
//             <ChevronLeft size={16} />
//           </button>
//           <span>
//             {currentMonth.toLocaleDateString('en-US', { 
//               month: 'long', 
//               year: 'numeric' 
//             })}
//           </span>
//           <button onClick={handleNextMonth} className="nav-btn">
//             <ChevronRight size={16} />
//           </button>
//         </div>
//         <div className="calendar-grid">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="calendar-weekday">{day}</div>
//           ))}
//           {days}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="app-container">
//       <div className="nav-container">
//         <div className="nav-controls">
//           <button onClick={handlePrevDay} className="nav-btn">
//             <ChevronLeft />
//           </button>
//           <button
//             onClick={() => setShowCalendar(!showCalendar)}
//             className="nav-btn"
//           >
//             <Calendar size={16} />
//           </button>
//           <button onClick={handleNextDay} className="nav-btn">
//             <ChevronRight />
//           </button>
//         </div>
//         {showCalendar && (
//           <div className="calendar-popup">
//             <CalendarView onSelect={setSelectedDate} />
//           </div>
//         )}
//       </div>
//       <div className="cards-container">
//         <div className="date-card">
//           <h2 className="date-header">{formatDate(selectedDate)}</h2>
//           <TodoList date={selectedDate} />
//         </div>
//         <div className="date-card">
//           <h2 className="date-header">{formatDate(getTomorrowDate(selectedDate))}</h2>
//           <TodoList date={getTomorrowDate(selectedDate)} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;

// import './App.css';
// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';
// import { supabase } from './supabaseClient';

// const TodoApp = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [todos, setTodos] = useState({});
//   const [loading, setLoading] = useState(false);
  

//   const getTomorrowDate = (date) => {
//     const tomorrow = new Date(date);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow;
//   };

//   const formatDateKey = (date) => date.toISOString().split('T')[0];

//   const fetchTodos = async () => {
//     const dateKey = formatDateKey(selectedDate);
//     setLoading(true);

//     const { data, error } = await supabase
//       .from('todos')
//       .select('*')
//       .eq('date', dateKey);

//     if (error) {
//       console.error('Error fetching todos:', error);
//     } else {
//       setTodos((prev) => ({
//         ...prev,
//         [dateKey]: data,
//       }));
//     }

//     setLoading(false);
//   };

//   const addTodo = async (date) => {
//     const dateKey = formatDateKey(date);
//     const newTodo = {
//       date: dateKey,
//       task: '',
//       checked: false,
//     };
  
//     try {
//       const { data, error } = await supabase.from('todos').insert([newTodo]).select();
  
//       if (error) {
//         console.error('Error adding todo:', error);
//         return;
//       }
  
//       // Safely update the state with the new todo
//       setTodos((prev) => {
//         const currentTodos = prev[dateKey] || []; // Ensure that currentTodos is always an array
//         return {
//           ...prev,
//           [dateKey]: [...currentTodos, ...data], // Add the new todo to the existing ones
//         };
//       });
//     } catch (err) {
//       console.error('Unexpected error:', err);
//     }
//   };
  

//   const updateTodo = async (date, todoId, newValue) => {
//     const dateKey = formatDateKey(date);
  
//     try {
//       const { data, error } = await supabase
//         .from('todos')
//         .update({ task: newValue })
//         .eq('id', todoId)
//         .select();
  
//       if (error) {
//         console.error('Error updating todo:', error);
//         return;
//       }
  
//       // Update the state while preserving the order
//       setTodos((prev) => ({
//         ...prev,
//         [dateKey]: prev[dateKey].map((todo) =>
//           todo.id === todoId ? { ...todo, task: newValue } : todo
//         ),
//       }));
//     } catch (err) {
//       console.error('Unexpected error:', err);
//     }
//   };
  

//   const toggleTodo = async (date, todoId) => {
//     const dateKey = formatDateKey(date);
  
//     try {
//       // Find the target task
//       const targetTask = todos[dateKey].find((todo) => todo.id === todoId);
//       if (!targetTask) return;
  
//       // Toggle the checked status
//       const { data, error } = await supabase
//         .from('todos')
//         .update({ checked: !targetTask.checked })
//         .eq('id', todoId)
//         .select();
  
//       if (error) {
//         console.error('Error toggling todo:', error);
//         return;
//       }
  
//       // Update the state while preserving the order
//       setTodos((prev) => ({
//         ...prev,
//         [dateKey]: prev[dateKey].map((todo) =>
//           todo.id === todoId ? { ...todo, checked: !todo.checked } : todo
//         ),
//       }));
//     } catch (err) {
//       console.error('Unexpected error:', err);
//     }
//   };
  
  
//   const removeTodo = async (date, todoId) => {
//     const { error } = await supabase.from('todos').delete().eq('id', todoId);

//     if (error) {
//       console.error('Error removing todo:', error);
//     } else {
//       fetchTodos(); // Refresh todos
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, [selectedDate]);

//   const TodoList = ({ date }) => {
//     const [dateTodos, setDateTodos] = useState([]);
//     const dateKey = formatDateKey(date);
  
//     useEffect(() => {
//       // Fetch data whenever the date changes
//       const fetchTodos = async () => {
//         try {
//           const { data, error } = await supabase
//             .from('todos')
//             .select('*')
//             .eq('date', dateKey)
//             .order('created_at', { ascending: true });
  
//           if (error) {
//             console.error('Error fetching todos:', error);
//             return;
//           }
//           setDateTodos(data || []);
//         } catch (err) {
//           console.error('Unexpected error:', err);
//         }
//       };
  
//       fetchTodos();
//     }, [dateKey]); // Trigger fetch when the date changes
  
//     const addTodo = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('todos')
//           .insert([{ date: dateKey, task: '', checked: false }])
//           .select();
  
//         if (error) {
//           console.error('Error adding todo:', error);
//           return;
//         }
  
//         setDateTodos((prev) => [...prev, ...data]); // Update state with the new todo
//       } catch (err) {
//         console.error('Unexpected error:', err);
//       }
//     };
  
//     const toggleTodo = async (todoId) => {
//       const targetTodo = dateTodos.find((todo) => todo.id === todoId);
//       if (!targetTodo) return;
  
//       try {
//         const { data, error } = await supabase
//           .from('todos')
//           .update({ checked: !targetTodo.checked })
//           .eq('id', todoId)
//           .select();
  
//         if (error) {
//           console.error('Error toggling todo:', error);
//           return;
//         }
  
//         setDateTodos((prev) =>
//           prev.map((todo) =>
//             todo.id === todoId ? { ...todo, checked: !todo.checked } : todo
//           )
//         );
//       } catch (err) {
//         console.error('Unexpected error:', err);
//       }
//     };
  
//     const removeTodo = async (todoId) => {
//       try {
//         const { error } = await supabase.from('todos').delete().eq('id', todoId);
  
//         if (error) {
//           console.error('Error removing todo:', error);
//           return;
//         }
  
//         setDateTodos((prev) => prev.filter((todo) => todo.id !== todoId));
//       } catch (err) {
//         console.error('Unexpected error:', err);
//       }
//     };
  
//     return (
//       <div className="todo-list">
//         {/* Add task UI */}
//         <button onClick={addTodo} className="add-todo-btn">
//           Add Todo
//         </button>
  
//         {/* Task table */}
//         <table>
//           <thead>
//             <tr>
//               <th>Done</th>
//               <th>Task</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dateTodos.map((todo) => (
//               <tr key={todo.id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={todo.checked}
//                     onChange={() => toggleTodo(todo.id)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     defaultValue={todo.task}
//                     onBlur={(e) =>
//                       updateTodo(date, todo.id, e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <button onClick={() => removeTodo(todo.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   return (
//     <div className="app-container">
//       <div className="nav-container">
//         <div className="nav-controls">
//           <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} className="nav-btn">
//             <ChevronLeft />
//           </button>
//           <button className="nav-btn" onClick={() => fetchTodos()}>
//             Refresh
//           </button>
//           <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} className="nav-btn">
//             <ChevronRight />
//           </button>
//         </div>
//       </div>
//       <div className="cards-container">
//         <div className="date-card">
//           <h2 className="date-header">{selectedDate.toDateString()}</h2>
//           <TodoList date={selectedDate} />
//         </div>
//         <div className="date-card">
//           <h2 className="date-header">{getTomorrowDate(selectedDate).toDateString()}</h2>
//           <TodoList date={getTomorrowDate(selectedDate)} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;

import './App.css';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from './supabaseClient';

const TodoApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState({});
  const [loading, setLoading] = useState(false);

  const getTomorrowDate = (date) => {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const formatDateKey = (date) => date.toISOString().split('T')[0];

  const fetchTodos = async () => {
    const dateKey = formatDateKey(selectedDate);
    const tomorrowKey = formatDateKey(getTomorrowDate(selectedDate));
    setLoading(true);

    try {
      const { data: todayData, error: todayError } = await supabase
        .from('todos')
        .select('*')
        .eq('date', dateKey)
        .order('position');

      const { data: tomorrowData, error: tomorrowError } = await supabase
        .from('todos')
        .select('*')
        .eq('date', tomorrowKey)
        .order('position');

      if (todayError || tomorrowError) {
        console.error('Error fetching todos:', todayError || tomorrowError);
      } else {
        setTodos({
          [dateKey]: todayData || [],
          [tomorrowKey]: tomorrowData || [],
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    setLoading(false);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDate = source.droppableId;
    const destDate = destination.droppableId;

    // Create new copy of todos
    const newTodos = { ...todos };

    // Remove from source array
    const [removed] = newTodos[sourceDate].splice(source.index, 1);
    
    // Add to destination array
    newTodos[destDate].splice(destination.index, 0, {
      ...removed,
      date: destDate
    });

    // Update positions
    const updatedTodos = newTodos[destDate].map((todo, index) => ({
      ...todo,
      position: index
    }));

    // Update state optimistically
    setTodos(newTodos);

    try {
      // Update the moved todo's date and position
      await supabase
        .from('todos')
        .update({
          date: destDate,
          position: destination.index
        })
        .eq('id', removed.id);

      // Update positions of affected todos
      for (const todo of updatedTodos) {
        await supabase
          .from('todos')
          .update({ position: todo.position })
          .eq('id', todo.id);
      }
    } catch (error) {
      console.error('Error updating todos:', error);
      // Revert state on error
      fetchTodos();
    }
  };

  const TodoList = ({ date }) => {
    const dateKey = formatDateKey(date);

    const addTodo = async () => {
      try {
        const position = todos[dateKey]?.length || 0;
        const { data, error } = await supabase
          .from('todos')
          .insert([{ date: dateKey, task: '', checked: false, position }])
          .select();

        if (error) {
          console.error('Error adding todo:', error);
          return;
        }

        setTodos(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), ...data]
        }));
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    const updateTodo = async (todoId, newValue) => {
      try {
        const { error } = await supabase
          .from('todos')
          .update({ task: newValue })
          .eq('id', todoId);

        if (error) {
          console.error('Error updating todo:', error);
          return;
        }

        setTodos(prev => ({
          ...prev,
          [dateKey]: prev[dateKey].map(todo =>
            todo.id === todoId ? { ...todo, task: newValue } : todo
          )
        }));
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    const toggleTodo = async (todoId) => {
      try {
        const targetTodo = todos[dateKey].find(todo => todo.id === todoId);
        const { error } = await supabase
          .from('todos')
          .update({ checked: !targetTodo.checked })
          .eq('id', todoId);

        if (error) {
          console.error('Error toggling todo:', error);
          return;
        }

        setTodos(prev => ({
          ...prev,
          [dateKey]: prev[dateKey].map(todo =>
            todo.id === todoId ? { ...todo, checked: !todo.checked } : todo
          )
        }));
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    const removeTodo = async (todoId) => {
      try {
        const { error } = await supabase
          .from('todos')
          .delete()
          .eq('id', todoId);

        if (error) {
          console.error('Error removing todo:', error);
          return;
        }

        setTodos(prev => ({
          ...prev,
          [dateKey]: prev[dateKey].filter(todo => todo.id !== todoId)
        }));
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    return (
      <div className="todo-list">
        <button onClick={addTodo} className="add-todo-btn">
          <Plus className="w-4 h-4" /> Add Todo
        </button>

        <Droppable droppableId={dateKey}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="todo-items"
            >
              {todos[dateKey]?.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`todo-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.checked}
                        onChange={() => toggleTodo(todo.id)}
                        className="todo-checkbox"
                      />
                      <input
                        type="text"
                        defaultValue={todo.task}
                        onBlur={(e) => updateTodo(todo.id, e.target.value)}
                        className="todo-input"
                      />
                      <button
                        onClick={() => removeTodo(todo.id)}
                        className="remove-todo-btn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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

  useEffect(() => {
    fetchTodos();
  }, [selectedDate]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <div className="nav-container">
          <div className="nav-controls">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
              className="nav-btn"
            >
              <ChevronLeft />
            </button>
            <button className="nav-btn" onClick={fetchTodos}>
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
              className="nav-btn"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="cards-container">
          <div className="date-card">
            <h2 className="date-header">{selectedDate.toDateString()}</h2>
            <TodoList date={selectedDate} />
          </div>
          <div className="date-card">
            <h2 className="date-header">{getTomorrowDate(selectedDate).toDateString()}</h2>
            <TodoList date={getTomorrowDate(selectedDate)} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TodoApp;