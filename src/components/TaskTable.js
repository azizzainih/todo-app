import React, { useState } from "react";

const TaskTable = ({ tasks, onEditTask, onDeleteTask }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditValue(task.name);
  };

  const handleConfirm = () => {
    onEditTask({ ...editingTask, name: editValue });
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  return (
    <table>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onEditTask({ ...task, completed: !task.completed })}
              />
            </td>
            <td>
              {editingTask === task.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                task.name
              )}
            </td>
            <td>
              {editingTask === task.id ? (
                <>
                  <button onClick={handleConfirm}>Confirm</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button onClick={() => onDeleteTask(task.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
