
import './App.css';
import './CalendarPicker.css';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from './supabaseClient';
import CalendarPicker from './CalendarPicker';

const TodoApp = () => {
  
  const [todos, setTodos] = useState({});
  const [healthData, setHealthData] = useState({});
  // const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const UTC_OFFSET = 7;

  const getLocalDate = (date = new Date()) => {
    const utcDate = new Date(date);
    utcDate.setUTCHours(utcDate.getUTCHours() + UTC_OFFSET);
    return new Date(utcDate.toISOString().split('T')[0]);
  };
  
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  
  const getTomorrowDate = useCallback((date) => {
    const tomorrow = getLocalDate(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }, []); // Empty dependency array since it doesn't depend on any props or state
  
  const getDateType = (date) => {
    const today = getLocalDate();
    const cardDate = new Date(date);
    
    // Reset time components for accurate date comparison
    today.setHours(0, 0, 0, 0);
    cardDate.setHours(0, 0, 0, 0);
    
    if (cardDate.getTime() === today.getTime()) {
      return 'today';
    } else if (cardDate.getTime() > today.getTime()) {
      return 'future';
    } else {
      return 'past';
    }
  };

  const getCardClassName = (date) => {
    const dateType = getDateType(date);
    return `date-card ${dateType}-card`;
  };
  
  const formatDateKey = (date) => {
    const utcDate = new Date(date);
    utcDate.setUTCHours(UTC_OFFSET, 0, 0, 0);
    return utcDate.toISOString().split('T')[0];
  };

  const fetchTodos = useCallback(async () => {
    const dateKey = formatDateKey(selectedDate);
    const tomorrowKey = formatDateKey(getTomorrowDate(selectedDate));
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
  }, [selectedDate, getTomorrowDate]); // Added getTomorrowDate to dependencies
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);


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

  const fetchHealthData = useCallback(async () => {
      const dateKey = formatDateKey(selectedDate);
      const tomorrowKey = formatDateKey(getTomorrowDate(selectedDate));
      
      try {
        const { data: todayData, error: todayError } = await supabase
          .from('health_tracking')
          .select('*')
          .eq('date', dateKey)
          .single();
  
        const { data: tomorrowData, error: tomorrowError } = await supabase
          .from('health_tracking')
          .select('*')
          .eq('date', tomorrowKey)
          .single();
  
        const defaultHealth = {
          vitamins: false,
          breakfast: '',
          lunch: '',
          dinner: ''
        };
  
        setHealthData({
          [dateKey]: todayData || defaultHealth,
          [tomorrowKey]: tomorrowData || defaultHealth
        });
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }, [selectedDate, getTomorrowDate]);
  
    useEffect(() => {
      fetchTodos();
      fetchHealthData();
    }, [fetchTodos, fetchHealthData]);

  const TodoList = ({ date }) => {
    const dateKey = formatDateKey(date);

    const updateHealthData = async (field, value) => {
      // Update local state immediately
      setHealthData(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [field]: value
        }
      }));

      // Update database silently
      try {
        const { error } = await supabase
          .from('health_tracking')
          .upsert(
            {
              date: dateKey,
              ...healthData[dateKey],
              [field]: value
            },
            { onConflict: 'date' }
          );

        if (error) {
          console.error('Error updating health data:', error);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    const calculateProgress = () => {
      if (!todos[dateKey]?.length) return 0;
      const completed = todos[dateKey].filter(todo => todo.checked).length;
      return Math.round((completed / todos[dateKey].length) * 100);
    };
  
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
      // Find the current todo
      const targetTodo = todos[dateKey].find(todo => todo.id === todoId);
      const newCheckedState = !targetTodo.checked;
      
      // Immediately update UI
      setTodos(prev => ({
        ...prev,
        [dateKey]: prev[dateKey].map(todo =>
          todo.id === todoId ? { ...todo, checked: newCheckedState } : todo
        )
      }));
  
      try {
        // Update database in background
        const { error } = await supabase
          .from('todos')
          .update({ checked: newCheckedState })
          .eq('id', todoId);
  
        if (error) {
          // If database update fails, revert the UI change
          console.error('Error toggling todo:', error);
          setTodos(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].map(todo =>
              todo.id === todoId ? { ...todo, checked: !newCheckedState } : todo
            )
          }));
        }
      } catch (err) {
        // Handle any unexpected errors
        console.error('Unexpected error:', err);
        // Revert UI change
        setTodos(prev => ({
          ...prev,
          [dateKey]: prev[dateKey].map(todo =>
            todo.id === todoId ? { ...todo, checked: !newCheckedState } : todo
          )
        }));
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
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <span className="progress-text">{calculateProgress()}%</span>
        </div>
        <div className="health-tracker">
          <div className="checklist-row">
            <div className="checklist-item">
              <input
                type="checkbox"
                checked={healthData[dateKey]?.vitamins || false}
                onChange={(e) => updateHealthData('vitamins', e.target.checked)}
                className={`checklist-checkbox ${healthData[dateKey]?.vitamins ? 'checked' : ''}`}
              />
              <span className="checklist-label">Daily Vitamins</span>
            </div>
          </div>

          <div className="meal-tracking-row">
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <div key={meal} className="meal-input-group">
                <label className="meal-label">
                  {meal}
                </label>
                <input
                  type="text"
                  value={healthData[dateKey]?.[meal] || ''}
                  onChange={(e) => updateHealthData(meal, e.target.value)}
                  placeholder={`${meal} meal`}
                  className="meal-input"
                />
              </div>
            ))}
          </div>
        </div>
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
                      className={`todo-item ${snapshot.isDragging ? 'dragging' : ''} ${
                        todo.checked ? 'completed' : ''
                      }`}
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <div className="nav-container">
          <div className="nav-controls">
            <button
              onClick={() => {
                const newDate = getLocalDate(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
              className="nav-btn"
            >
              <ChevronLeft />
            </button>
            <div className="relative inline-block">  {/* Updated this div */}
              <button 
                onClick={() => setShowCalendar(prev => !prev)}
                className="nav-btn"
              >
                <Calendar className="w-4 h-4" />
              </button>
              {showCalendar && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                  <CalendarPicker
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                    onClose={() => setShowCalendar(false)}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => {
                const newDate = getLocalDate(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
              className="nav-btn"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="cards-container">
          <div className={getCardClassName(selectedDate)}>
            <h2 className="date-header">
              <span className="weekday">{selectedDate.toLocaleDateString('id-ID', { weekday: 'long' })}</span>
              <span className="date">{selectedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </h2>
            <TodoList date={selectedDate} />
          </div>
          <div className={getCardClassName(getTomorrowDate(selectedDate))}>
            <h2 className="date-header">
              <span className="weekday">{getTomorrowDate(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
              <span className="date">{getTomorrowDate(selectedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </h2>
            <TodoList date={getTomorrowDate(selectedDate)} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TodoApp;

