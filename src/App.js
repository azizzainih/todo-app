
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

import './App.css';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { supabase } from './supabaseClient';

const TodoApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [todos, setTodos] = useState({});

  const getTomorrowDate = (date) => {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePrevDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate); // Clone the date
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate); // Clone the date
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const loadTodos = async (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const { data, error } = await supabase.from('todos').select('*').eq('date', dateKey);

    if (error) {
      console.error('Error loading todos:', error.message);
      return [];
    }

    setTodos((prev) => ({
      ...prev,
      [dateKey]: data,
    }));
  };

  useEffect(() => {
    loadTodos(selectedDate);
    loadTodos(getTomorrowDate(selectedDate));
  }, [selectedDate]);

  const addTodo = async (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const newTodo = { date: dateKey, checked: false, task: '' };

    const { data, error } = await supabase.from('todos').insert([newTodo]);

    if (error) {
      console.error('Error adding todo:', error.message);
      return;
    }

    setTodos((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), data[0]],
    }));
  };

  const updateTodo = async (date, todoId, value) => {
    const { error } = await supabase.from('todos').update({ task: value }).eq('id', todoId);

    if (error) {
      console.error('Error updating todo:', error.message);
      return;
    }

    const dateKey = date.toISOString().split('T')[0];
    setTodos((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((todo) =>
        todo.id === todoId ? { ...todo, task: value } : todo
      ),
    }));
  };

  const toggleTodo = async (date, todoId) => {
    const dateKey = date.toISOString().split('T')[0];
    const todo = todos[dateKey].find((t) => t.id === todoId);

    const { error } = await supabase.from('todos').update({ checked: !todo.checked }).eq('id', todoId);

    if (error) {
      console.error('Error toggling todo:', error.message);
      return;
    }

    setTodos((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((t) =>
        t.id === todoId ? { ...t, checked: !t.checked } : t
      ),
    }));
  };

  const removeTodo = async (date, todoId) => {
    const { error } = await supabase.from('todos').delete().eq('id', todoId);

    if (error) {
      console.error('Error removing todo:', error.message);
      return;
    }

    const dateKey = date.toISOString().split('T')[0];
    setTodos((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((todo) => todo.id !== todoId),
    }));
  };

  const TodoList = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const dateTodos = todos[dateKey] || [];

    const completedCount = dateTodos.filter((todo) => todo.checked).length;
    const totalCount = dateTodos.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
      <div className="todo-list">
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className="progress-text">
            {completedCount}/{totalCount} ({progressPercentage}%)
          </span>
        </div>
        <table className="todo-table">
          <thead>
            <tr>
              <th>Done</th>
              <th>Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dateTodos.map((todo) => (
              <tr key={todo.id} className={todo.checked ? 'completed-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.checked}
                    onChange={() => toggleTodo(date, todo.id)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={todo.task}
                    onBlur={(e) => updateTodo(date, todo.id, e.target.value)}
                    className="todo-input"
                    placeholder="Enter your task..."
                  />
                </td>
                <td>
                  <button onClick={() => removeTodo(date, todo.id)} className="remove-todo-btn">
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => addTodo(date)} className="add-todo-btn">
          <Plus size={16} /> Add Todo
        </button>
      </div>
    );
  };

  const CalendarView = ({ onSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const handlePrevMonth = () => {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(
        <button
          key={day}
          onClick={() => {
            onSelect(date);
            setShowCalendar(false);
          }}
          className="calendar-day"
        >
          {day}
        </button>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="nav-btn">
            <ChevronLeft size={16} />
          </button>
          <span>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth} className="nav-btn">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="nav-container">
        <div className="nav-controls">
          <button onClick={handlePrevDay} className="nav-btn">
            <ChevronLeft />
          </button>
          <button onClick={() => setShowCalendar(!showCalendar)} className="nav-btn">
            <Calendar size={16} />
          </button>
          <button onClick={handleNextDay} className="nav-btn">
            <ChevronRight />
          </button>
        </div>
        {showCalendar && (
          <div className="calendar-popup">
            <CalendarView onSelect={(date) => setSelectedDate(date)} />
          </div>
        )}
      </div>
      <div className="card-container">
        <div className="card">
          <h2>{formatDate(selectedDate)}</h2>
          <TodoList date={selectedDate} />
        </div>
        <div className="card">
          <h2>{formatDate(getTomorrowDate(selectedDate))}</h2>
          <TodoList date={getTomorrowDate(selectedDate)} />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
