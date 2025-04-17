
// 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
// TodoApp.js (main component)
import './styles/App.css';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { supabase } from './supabaseClient';
import CalendarPicker from './components/CalendarPicker';
import HealthTracker from './components/HealthTracker';
import TodoList from './components/TodoList';
import Journal from './components/Journal';
import TimeProgress from './components/TimeProgress';

const TodoApp = () => {
  const [todos, setTodos] = useState({});
  const [healthData, setHealthData] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const UTC_OFFSET = 7;

  // ... keep all your existing date-related utility functions ...
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

  const flattenTodos = (todos, parentId = null) => {
    let flattened = [];
    todos.forEach(todo => {
      flattened.push({ ...todo, parent_id: parentId });
      if (todo.subtasks?.length) {
        flattened = flattened.concat(flattenTodos(todo.subtasks, todo.id));
      }
    });
    return flattened;
  };
  
  const fetchTodos = useCallback(async () => {
    const dateKey = formatDateKey(selectedDate);
    const tomorrowKey = formatDateKey(getTomorrowDate(selectedDate));
  
    try {
      const { data: allTodos, error } = await supabase
        .from('todos')
        .select('*')
        .in('date', [dateKey, tomorrowKey])
        .order('position');
  
      if (error) {
        console.error('Error fetching todos:', error);
        return;
      }
  
      // Organize todos into a hierarchy
      const organizeSubtasks = (todos, parentId = null) => {
        const result = todos
          .filter(todo => todo.parent_id === parentId)
          .map(todo => ({
            ...todo,
            subtasks: organizeSubtasks(todos, todo.id)
          }));
        return result;
      };
  
      const organizedTodos = {
        [dateKey]: organizeSubtasks(allTodos.filter(todo => todo.date === dateKey)),
        [tomorrowKey]: organizeSubtasks(allTodos.filter(todo => todo.date === tomorrowKey))
      };
  
      setTodos(organizedTodos);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }, [selectedDate, getTomorrowDate]);

  const fetchHealthData = useCallback(async () => {
    // ... keep existing fetchHealthData implementation ...
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

  const updateHealthData = async (dateKey, field, value) => {
    setHealthData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [field]: value
      }
    }));

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

  const addTodo = async (dateKey) => {
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

  const updateTodo = async (dateKey, todoId, newValue) => {
    // ... keep existing updateTodo implementation ...
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

  const toggleTodo = async (dateKey, todoId, level) => {
    const updateTodoState = (tasks, targetId, newCheckedState) => {
      return tasks.map(task => {
        if (task.id === todoId) {
          const updatedTask = {
            ...task,
            checked: newCheckedState
          };
          // Update subtasks to match parent's state
          if (task.subtasks?.length) {
            updatedTask.subtasks = task.subtasks.map(subtask => ({
              ...subtask,
              checked: newCheckedState
            }));
          }
          return updatedTask;
        } else if (task.subtasks?.length) {
          const updatedSubtasks = updateTodoState(task.subtasks, targetId, newCheckedState);
          // Check if all subtasks are checked and update parent accordingly
          const allSubtasksChecked = updatedSubtasks.every(st => st.checked);
          return {
            ...task,
            checked: allSubtasksChecked,
            subtasks: updatedSubtasks
          };
        }
        return task;
      });
    };
  
    // Find the current todo and its new state
    let targetTodo;
    const findTodo = (tasks) => {
      for (const task of tasks) {
        if (task.id === todoId) {
          targetTodo = task;
          return;
        }
        if (task.subtasks?.length) {
          findTodo(task.subtasks);
        }
      }
    };
    findTodo(todos[dateKey]);
  
    const newCheckedState = !targetTodo.checked;
  
    // Update UI
    setTodos(prev => ({
      ...prev,
      [dateKey]: updateTodoState(prev[dateKey], todoId, newCheckedState)
    }));
  
    try {
      // Update database
      const { error } = await supabase
        .from('todos')
        .update({ checked: newCheckedState })
        .eq('id', todoId);
  
      if (error) {
        console.error('Error toggling todo:', error);
        // Revert UI state on error
        setTodos(prev => ({
          ...prev,
          [dateKey]: updateTodoState(prev[dateKey], todoId, !newCheckedState)
        }));
      }
  
      // If this is a parent task, update all subtasks in the database
      if (targetTodo.subtasks?.length) {
        const subtaskIds = [];
        const collectSubtaskIds = (tasks) => {
          tasks.forEach(task => {
            subtaskIds.push(task.id);
            if (task.subtasks?.length) {
              collectSubtaskIds(task.subtasks);
            }
          });
        };
        collectSubtaskIds(targetTodo.subtasks);
  
        const { error: subtaskError } = await supabase
          .from('todos')
          .update({ checked: newCheckedState })
          .in('id', subtaskIds);
  
        if (subtaskError) {
          console.error('Error updating subtasks:', subtaskError);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const removeTodo = async (dateKey, todoId) => {
    try {
      // First, update the UI optimistically
      setTodos(prev => {
        const updateTodos = (todos) => {
          return todos.map(todo => {
            // If this todo has subtasks, recursively check them
            if (todo.subtasks?.length) {
              return {
                ...todo,
                subtasks: updateTodos(todo.subtasks).filter(t => t.id !== todoId)
              };
            }
            return todo;
          }).filter(todo => todo.id !== todoId); // Filter out the todo if it matches todoId
        };
  
        return {
          ...prev,
          [dateKey]: updateTodos(prev[dateKey] || [])
        };
      });
  
      // Then update the database
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId);
  
      if (error) {
        console.error('Error removing todo:', error);
        // If there's an error, refetch todos to ensure UI is in sync
        fetchTodos();
        return;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      // On error, refetch todos to ensure UI is in sync
      fetchTodos();
    }
  };

  const addSubtask = async (dateKey, parentId) => {
    try {
      // Find the parent task and its current subtasks
      const findParentTask = (tasks) => {
        for (const task of tasks) {
          if (task.id === parentId) {
            return task;
          }
          if (task.subtasks?.length) {
            const found = findParentTask(task.subtasks);
            if (found) return found;
          }
        }
        return null;
      };
  
      const parentTask = findParentTask(todos[dateKey]);
      const position = parentTask?.subtasks?.length || 0;
  
      const newSubtask = {
        date: dateKey,
        task: '',
        checked: false,
        parent_id: parentId,
        position: position
      };
  
      const { data, error } = await supabase
        .from('todos')
        .insert([newSubtask])
        .select();
  
      if (error) {
        console.error('Error adding subtask:', error);
        return;
      }
  
      setTodos(prev => {
        const updateSubtasks = (tasks) => {
          return tasks.map(task => {
            if (task.id === parentId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), ...data]
              };
            }
            if (task.subtasks?.length) {
              return {
                ...task,
                subtasks: updateSubtasks(task.subtasks)
              };
            }
            return task;
          });
        };
  
        return {
          ...prev,
          [dateKey]: updateSubtasks(prev[dateKey] || [])
        };
      });
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  const onDragEnd = async (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
    const sourceDate = source.droppableId;
    const destDate = destination.droppableId;
  
    try {
      // Create a deep copy of the current todos
      const newTodos = JSON.parse(JSON.stringify(todos));
  
      // Get the dragged item from the source
      const draggedItem = newTodos[sourceDate][source.index];
      
      // Remove from source
      newTodos[sourceDate].splice(source.index, 1);
  
      // Ensure destination array exists
      if (!newTodos[destDate]) {
        newTodos[destDate] = [];
      }
  
      // Add to destination
      newTodos[destDate].splice(destination.index, 0, {
        ...draggedItem,
        date: destDate
      });
  
      // Update state optimistically
      setTodos(newTodos);
  
      // Update database
      await supabase
        .from('todos')
        .update({
          date: destDate,
          position: destination.index
        })
        .eq('id', draggedItem.id);
  
      // Update positions in database
      const updatePromises = newTodos[destDate].map((todo, index) => 
        supabase
          .from('todos')
          .update({ position: index })
          .eq('id', todo.id)
      );
  
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating todos:', error);
      // Revert state on error
      fetchTodos();
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <div className="nav-container">
        <a
          href="https://expenses-tracker-app-eta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >Exprenses Tracker</a>
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
        <TimeProgress />
        <div className="cards-container">
          {[selectedDate, getTomorrowDate(selectedDate)].map((date) => {
            const dateKey = formatDateKey(date);
            return (
              <div key={dateKey} className={getCardClassName(date)}>
                <h2 className="date-header">
                  <span className="weekday">
                    {date.toLocaleDateString('id-ID', { weekday: 'long' })}
                  </span>
                  <span className="date">
                    {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </h2>
                <HealthTracker
                  dateKey={dateKey}
                  healthData={healthData}
                  updateHealthData={updateHealthData}
                />
                <TodoList
                  dateKey={dateKey}
                  todos={todos}
                  onAddTodo={addTodo}
                  onUpdateTodo={updateTodo}
                  onToggleTodo={toggleTodo}
                  onRemoveTodo={removeTodo}
                  onAddSubtask={addSubtask}
                />
                <Journal dateKey={dateKey} supabase={supabase} />
              </div>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default TodoApp;
