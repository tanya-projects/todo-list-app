import React from 'react';
import Task from './Task';
import classes from './TaskList.module.css';

/**
 * TaskList Component - returns sorted task list
 * @module TaskList
 */
export default function TaskList(props) {
  /**
   * Creates a shallow copy of all Tasks
   * @type {Array}
   * @name sortedTasks
   */
  const sortedTasks = [...props.tasks];

  /**
   * Sort tasks on priority first (new - in process - done), then alphabetically by title
   * @function sort - sort array of created tasks
   * @param {*} a - first item to compare
   * @param {*} b - second item to compare
   */
  sortedTasks.sort((a, b) => {
    if (a.priority === b.priority) {
      if (a.title > b.title) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.priority < b.priority) {
      return 1;
    } else {
      return -1;
    }
  });

  /**
   * Deleting Task from Task list
   * @function deleteTaskHandler
   * @param {string} taskKey - Key of task we want to delete
   */
  const deleteTaskHandler = (taskKey) => {
    props.onDeleteTask(taskKey);
  };

  /**
   * Change Task fields
   * @function changeTaskHandler
   * @param {string} task - Current Task key
   * @param {string} title - Task Title
   * @param {sting} status - Task status (new, in process, or done)
   * @param {string} description - Task description
   * @param {string} deadline - Task deadline (formatted as string)
   * @param {Array} fileList - Files attached to task
   */
  const changeTaskHandler = (
    task,
    title,
    status,
    description,
    deadline,
    fileList
  ) => {
    props.onChangeTask(task, title, status, description, deadline, fileList);
  };

  /**
   * Get all Tasks data for setting local storage in childen component
   * @function updateStorageHandler
   * @returns {Array<object>} - All tasks data
   */
  const updateStorageHandler = () => {
    return props.tasks;
  };

  // no tasks in todo list
  if (props.tasks.length === 0) return;
  return (
    <ul className={classes.taskList}>
      {sortedTasks.map((task) => (
        <li key={task.key}>
          <Task
            task={task}
            onDeleteTask={deleteTaskHandler}
            onChangeTask={changeTaskHandler}
            onUpdateStorage={updateStorageHandler}
          />
        </li>
      ))}
    </ul>
  );
}
