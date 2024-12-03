import React from "react";
import TaskTable from "./TaskTable";

const TaskCard = ({ title, date, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const dateStr = date.toISOString().slice(0, 10);
  const filteredTasks = tasks.filter(task => task.date === dateStr);

  const handleAddTask = () => {
    const taskName = prompt("Enter task name:");
    if (taskName) {
      onAddTask({ id: Date.now(), name: taskName, date: dateStr, completed: false });
    }
  };

  return (
    <div className="task-card">
      <h2>{title}</h2>
      <TaskTable
        tasks={filteredTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskCard;

