import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const initialColumns = {
  todo: { name: 'Todo', tasks: [] },
  inProgress: { name: 'In Progress', tasks: [] },
  completed: { name: 'Completed', tasks: [] },
};

export default function Home() {
  const [columns, setColumns] = useState(initialColumns);
  const [taskName, setTaskName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('todo');

  useEffect(() => {
    const savedColumns = localStorage.getItem('columns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    if (columns !== initialColumns) {
      localStorage.setItem('columns', JSON.stringify(columns));
    }
  }, [columns]);

  const addTask = () => {
    if (!taskName.trim()) return;

    const newTask = { id: Date.now().toString(), content: taskName };
    const updatedColumn = {
      ...columns[selectedColumn],
      tasks: [...columns[selectedColumn].tasks, newTask],
    };

    setColumns({
      ...columns,
      [selectedColumn]: updatedColumn,
    });
    setTaskName('');
  };

  const changeTaskStatus = (taskId, currentColumnId) => {
    const columnOrder = ['todo', 'inProgress', 'completed'];
    const currentIndex = columnOrder.indexOf(currentColumnId);
    const nextColumnId = columnOrder[(currentIndex + 1) % columnOrder.length];

    const currentColumn = columns[currentColumnId];
    const nextColumn = columns[nextColumnId];

    const taskToMove = currentColumn.tasks.find((task) => task.id === taskId);
    const updatedCurrentTasks = currentColumn.tasks.filter((task) => task.id !== taskId);
    const updatedNextTasks = [...nextColumn.tasks, taskToMove];

    setColumns({
      ...columns,
      [currentColumnId]: {
        ...currentColumn,
        tasks: updatedCurrentTasks,
      },
      [nextColumnId]: {
        ...nextColumn,
        tasks: updatedNextTasks,
      },
    });
  };

  return (
    <div className={styles.container}>

      <div className={styles.addTaskContainer}>
        <input
          type="text"
          placeholder="Enter a task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={styles.taskInput}
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className={styles.columnSelect}
        >
          <option value="todo">Todo</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={addTask} className={styles.addTaskButton}>
          Add Task
        </button>
      </div>

      <div className={styles.board}>
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className={styles.column}>
            <h2>{column.name}</h2>
            <div className={styles.taskList}>
              {column.tasks.map((task) => (
                <div key={task.id} className={styles.task}>
                  {task.content}
                  {columnId !== 'completed' && (
                    <button
                      onClick={() => changeTaskStatus(task.id, columnId)}
                      className={styles.statusButton}
                    >
                      Move to {columnId === 'todo' ? 'In Progress' : 'Completed'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
