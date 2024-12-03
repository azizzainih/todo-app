
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
//     setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
//   };

//   const handleNextDay = () => {
//     setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
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
//     return (
//       <div className="todo-list">
//         {dateTodos.map((todo) => (
//           <div key={todo.id} className="todo-card">
//             <div className="todo-content">
//               <input
//                 type="checkbox"
//                 checked={todo.checked}
//                 onChange={() => toggleTodo(date, todo.id)}
//                 className="todo-checkbox"
//               />
//               <input
//                 type="text"
//                 defaultValue={todo.task}
//                 onBlur={(e) => updateTodo(date, todo.id, e.target.value)}
//                 className="todo-input"
//                 placeholder="Enter your task..."
//               />
//               <button
//                 onClick={() => removeTodo(date, todo.id)}
//                 className="remove-todo-btn"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
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
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async (date) => {
    setLoading(true);
    const dateKey = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('date', dateKey);

    if (error) {
      console.error(error);
    } else {
      setTodos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos(selectedDate);
  }, [selectedDate]);

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
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  const addTodo = async (date) => {
    const newTodo = {
      date: date.toISOString().split('T')[0],
      task: '',
      checked: false,
    };
  
    const { data, error } = await supabase.from('todos').insert(newTodo);
  
    if (error) {
      console.error(error);
    } else {
      setTodos((prev) => [...prev, data[0]]);
    }
  };
  
  const updateTodo = async (date, todoId, value) => {
    const { error } = await supabase
      .from('todos')
      .update({ task: value })
      .eq('id', todoId);
  
    if (error) {
      console.error(error);
    } else {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId ? { ...todo, task: value } : todo
        )
      );
    }
  };
  
  const toggleTodo = async (todoId, currentChecked) => {
    const { error } = await supabase
      .from('todos')
      .update({ checked: !currentChecked })
      .eq('id', todoId);
  
    if (error) {
      console.error(error);
    } else {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId ? { ...todo, checked: !currentChecked } : todo
        )
      );
    }
  };
  
  const removeTodo = async (todoId) => {
  const { error } = await supabase.from('todos').delete().eq('id', todoId);

  if (error) {
    console.error(error);
  } else {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  }
};


  const TodoList = ({ date }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-card">
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={() => toggleTodo(todo.id, todo.checked)}
                className="todo-checkbox"
              />
              <input
                type="text"
                defaultValue={todo.task}
                onBlur={(e) => updateTodo(date, todo.id, e.target.value)}
                className="todo-input"
                placeholder="Enter your task..."
              />
              <button
                onClick={() => removeTodo(todo.id)}
                className="remove-todo-btn"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => addTodo(date)} className="add-todo-btn">
          <Plus size={16} /> Add Todo
        </button>
      </div>
    );
  };

  const CalendarView = ({ onSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
  
    // Determine the number of days in the current month
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
  
    // Determine the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
  
    // Navigate to the previous month
    const handlePrevMonth = () => {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };
  
    // Navigate to the next month
    const handleNextMonth = () => {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };
  
    // Generate the calendar days
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
            onSelect(date); // Pass the selected date to the parent component
          }}
          className="calendar-day"
        >
          {day}
        </button>
      );
    }
  
    return (
      <div className="calendar">
        {/* Header with navigation buttons and current month/year */}
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="nav-btn">
            <ChevronLeft size={16} />
          </button>
          <span>
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button onClick={handleNextMonth} className="nav-btn">
            <ChevronRight size={16} />
          </button>
        </div>
  
        {/* Calendar grid with weekdays and days */}
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
  

  const tomorrowDate = getTomorrowDate(selectedDate);

  return (
    <div className="app-container">
      {/* Navigation controls */}
      <div className="nav-container">
        <div className="nav-controls">
          <button onClick={handlePrevDay} className="nav-btn">
            <ChevronLeft />
          </button>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="nav-btn"
          >
            <Calendar size={16} />
          </button>
          <button onClick={handleNextDay} className="nav-btn">
            <ChevronRight />
          </button>
        </div>
  
        {/* Calendar popup */}
        {showCalendar && (
          <div className="calendar-popup">
            <CalendarView onSelect={setSelectedDate} />
          </div>
        )}
      </div>
  
      {/* Cards container */}
      <div className="cards-container">
        {/* Today's date card */}
        <div className="date-card">
          <h2 className="date-header">{formatDate(selectedDate)}</h2>
          <TodoList date={selectedDate} />
        </div>
  
        {/* Tomorrow's date card */}
        <div className="date-card">
          <h2 className="date-header">{formatDate(getTomorrowDate(selectedDate))}</h2>
          <TodoList date={getTomorrowDate(selectedDate)} />
        </div>
      </div>
    </div>
  );
  
};

export default TodoApp;
