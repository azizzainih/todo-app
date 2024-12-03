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
import './App.css';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';

const TodoApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [todos, setTodos] = useState({});

  // Get tomorrow's date
  const tomorrow = new Date(selectedDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const addTodo = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { 
        checked: false, 
        fields: [{ label: 'Task', value: '' }],
        id: Date.now()
      }]
    }));
  };

  const toggleTodo = (date, todoIndex) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map((todo, index) => 
        index === todoIndex ? { ...todo, checked: !todo.checked } : todo
      )
    }));
  };

  const addField = (date, todoIndex) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map((todo, index) => 
        index === todoIndex 
          ? { ...todo, fields: [...todo.fields, { label: 'New Field', value: '' }] }
          : todo
      )
    }));
  };

  const updateField = (date, todoIndex, fieldIndex, key, value) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map((todo, index) => 
        index === todoIndex 
          ? { 
              ...todo, 
              fields: todo.fields.map((field, fIndex) => 
                fIndex === fieldIndex ? { ...field, [key]: value } : field
              )
            }
          : todo
      )
    }));
  };

  const removeTodo = (date, todoIndex) => {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((_, index) => index !== todoIndex)
    }));
  };

  const TodoList = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const dateTodos = todos[dateKey] || [];

    return (
      <div className="todo-list">
        {dateTodos.map((todo, todoIndex) => (
          <div key={todo.id} className="todo-card">
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={() => toggleTodo(date, todoIndex)}
                className="todo-checkbox"
              />
              <div className="todo-fields">
                {todo.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="field-row">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(date, todoIndex, fieldIndex, 'label', e.target.value)}
                      className="field-label"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(date, todoIndex, fieldIndex, 'value', e.target.value)}
                      className="field-value"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addField(date, todoIndex)}
                  className="add-field-btn"
                >
                  <Plus size={16} /> Add Field
                </button>
              </div>
              <button
                onClick={() => removeTodo(date, todoIndex)}
                className="remove-todo-btn"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => addTodo(date)}
          className="add-todo-btn"
        >
          <Plus size={16} /> Add Todo
        </button>
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
            className="calendar-btn"
          >
            <Calendar size={16} />
            <span>Select Date</span>
          </button>
          <button onClick={handleNextDay} className="nav-btn">
            <ChevronRight />
          </button>
        </div>
        {showCalendar && (
          <div className="calendar-popup">
            <input 
              type="date" 
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value));
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="cards-container">
        <div className="date-card">
          <h2 className="date-header">{formatDate(selectedDate)}</h2>
          <TodoList date={selectedDate} />
        </div>

        <div className="date-card">
          <h2 className="date-header">{formatDate(tomorrow)}</h2>
          <TodoList date={tomorrow} />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;