// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <p>
//           Hehe First Deployed project cuy.
//         </p>
//         <p>
//           Lets go create proper Todo-app.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { supabase } from './supabaseClient';

// function App() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [age, setAge] = useState('');
//   const [users, setUsers] = useState([]);

//   // Fetch data from Supabase
//   const fetchUsers = async () => {
//     const { data, error } = await supabase.from('users').select('*');
//     if (error) {
//       console.error('Error fetching users:', error.message);
//     } else {
//       setUsers(data);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { data, error } = await supabase
//       .from('users')
//       .insert([{ name, email, age: parseInt(age) }]);

//     if (error) {
//       console.error('Error adding user:', error.message);
//     } else {
//       console.log('User added:', data);
//       setName('');
//       setEmail('');
//       setAge('');
//       fetchUsers();
//     }
//   };

//   return (
//     <div>
//       <h1>Supabase Form and Table</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Age"
//           value={age}
//           onChange={(e) => setAge(e.target.value)}
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Age</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.age}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;
// import './App.css';
// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';

// const TodoApp = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [todos, setTodos] = useState({});
//   const [editingTodos, setEditingTodos] = useState({});

//   // Get tomorrow's date
//   const tomorrow = new Date(selectedDate);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   const handlePrevDay = () => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() - 1);
//     setSelectedDate(newDate);
//   };

//   const handleNextDay = () => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() + 1);
//     setSelectedDate(newDate);
//   };

//   const addTodo = (date) => {
//     const dateKey = date.toISOString().split('T')[0];
//     const newTodo = {
//       checked: false,
//       task: '',
//       id: Date.now()
//     };
    
//     setTodos(prev => ({
//       ...prev,
//       [dateKey]: [...(prev[dateKey] || []), newTodo]
//     }));
    
//     // Initialize editing state for the new todo
//     setEditingTodos(prev => ({
//       ...prev,
//       [newTodo.id]: ''
//     }));
//   };

//   const toggleTodo = (date, todoIndex) => {
//     const dateKey = date.toISOString().split('T')[0];
//     setTodos(prev => ({
//       ...prev,
//       [dateKey]: prev[dateKey].map((todo, index) => 
//         index === todoIndex ? { ...todo, checked: !todo.checked } : todo
//       )
//     }));
//   };

//   const handleInputChange = (todoId, value) => {
//     setEditingTodos(prev => ({
//       ...prev,
//       [todoId]: value
//     }));
//   };

//   const handleInputBlur = (date, todoIndex, todoId) => {
//     const dateKey = date.toISOString().split('T')[0];
//     const value = editingTodos[todoId];
    
//     setTodos(prev => ({
//       ...prev,
//       [dateKey]: prev[dateKey].map((todo, index) => 
//         index === todoIndex ? { ...todo, task: value } : todo
//       )
//     }));
//   };

//   const removeTodo = (date, todoIndex) => {
//     const dateKey = date.toISOString().split('T')[0];
//     const todoToRemove = todos[dateKey][todoIndex];
    
//     setTodos(prev => ({
//       ...prev,
//       [dateKey]: prev[dateKey].filter((_, index) => index !== todoIndex)
//     }));

//     // Clean up editing state
//     setEditingTodos(prev => {
//       const newState = { ...prev };
//       delete newState[todoToRemove.id];
//       return newState;
//     });
//   };

//   const TodoList = ({ date }) => {
//     const dateKey = date.toISOString().split('T')[0];
//     const dateTodos = todos[dateKey] || [];

//     return (
//       <div className="todo-list">
//         {dateTodos.map((todo, todoIndex) => (
//           <div key={todo.id} className="todo-card">
//             <div className="todo-content">
//               <input
//                 type="checkbox"
//                 checked={todo.checked}
//                 onChange={() => toggleTodo(date, todoIndex)}
//                 className="todo-checkbox"
//               />
//               <input
//                 type="text"
//                 value={editingTodos[todo.id] ?? todo.task}
//                 onChange={(e) => handleInputChange(todo.id, e.target.value)}
//                 onBlur={() => handleInputBlur(date, todoIndex, todo.id)}
//                 className="todo-input"
//                 placeholder="Enter your task..."
//               />
//               <button
//                 onClick={() => removeTodo(date, todoIndex)}
//                 className="remove-todo-btn"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//         <button
//           onClick={() => addTodo(date)}
//           className="add-todo-btn"
//         >
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
//           <h2 className="date-header">{formatDate(tomorrow)}</h2>
//           <TodoList date={tomorrow} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;

import './App.css';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';

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
    setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  const addTodo = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const newTodo = {
      id: Date.now(),
      checked: false,
      task: '',
    };
    setTodos((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTodo],
    }));
  };

  const updateTodo = (date, todoId, value) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((todo) =>
        todo.id === todoId ? { ...todo, task: value } : todo
      ),
    }));
  };

  const toggleTodo = (date, todoId) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((todo) =>
        todo.id === todoId ? { ...todo, checked: !todo.checked } : todo
      ),
    }));
  };

  const removeTodo = (date, todoId) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((todo) => todo.id !== todoId),
    }));
  };

  const TodoList = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const dateTodos = todos[dateKey] || [];
    return (
      <div className="todo-list">
        {dateTodos.map((todo) => (
          <div key={todo.id} className="todo-card">
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={() => toggleTodo(date, todo.id)}
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
                onClick={() => removeTodo(date, todo.id)}
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
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
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
            {currentMonth.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <button onClick={handleNextMonth} className="nav-btn">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
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
        {showCalendar && (
          <div className="calendar-popup">
            <CalendarView onSelect={setSelectedDate} />
          </div>
        )}
      </div>
      <div className="cards-container">
        <div className="date-card">
          <h2 className="date-header">{formatDate(selectedDate)}</h2>
          <TodoList date={selectedDate} />
        </div>
        <div className="date-card">
          <h2 className="date-header">{formatDate(getTomorrowDate(selectedDate))}</h2>
          <TodoList date={getTomorrowDate(selectedDate)} />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;