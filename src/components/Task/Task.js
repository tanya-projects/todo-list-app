import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import Button from '../UI/Button';
import classes from './Task.module.css';
import TaskEdit from './TaskEdit';

/**
 * Display Task
 * @module Task
 */
export default function Task(props) {
  /**
   * State for editing mode
   * @name isEditing
   * @type {boolean}
   */
  const [isEditing, setIsEditing] = useState(false);

  // variable for files loaded
  /**
   * File list for current Task
   * @type {Array}
   * @name fileList
   */
  const filesList = props.task.files;

  /**
   * State for style task based on its status
   * @name styleTaskByStatus
   * @type {*}
   */
  const [styleTaskByStatus, setStyleTaskByStatus] = useState(classes.task__new);

  /**
   * State for adding styling for overdue tasks
   * @name isOverdue
   * @type {*}
   */
  const [isOverdue, setIsOverdue] = useState('');

  // useEffect for side effects (preventing infinite rerendering) - check for overdue task and set local storage
  useEffect(() => {
    /**
     * Compare today date and deadline date and set style for task if it's overdue
     * @function checkOverdueTasks
     *
     */
    const checkOverdueTasks = () => {
      /**
       * Object with retrieved date
       * @name dateTillObject
       * @type {object}
       */
      const dateTillObject = {
        day: props.task.date.split('.')[0],
        month: props.task.date.split('.')[1] - 1,
        year: props.task.date.split('.')[2],
      };

      /**
       * Setting deadline date as 23:59 on deadline day
       * @name checkDeadline
       * @type {date}
       */
      const checkDeadline = dayjs()
        .set('date', dateTillObject.day)
        .set('month', dateTillObject.month)
        .set('year', dateTillObject.year)
        .set('hour', 23)
        .set('minute', 59);

      /**
       * Set today date for comparing deadlines
       * @name today
       * @type {date}
       */
      const today = dayjs();

      if (checkDeadline >= today || props.task.status === 'выполнено') {
        setIsOverdue('');
      } else {
        setIsOverdue(classes.task__overdue);
      }
    };
    checkOverdueTasks();

    // set styles based on status
    if (props.task.status === 'выполнено') {
      setStyleTaskByStatus(classes.task__done);
    } else if (props.task.status === 'в процессе') {
      setStyleTaskByStatus(classes.task__processed);
    } else {
      setStyleTaskByStatus(classes.task__new);
    }

    // set local storage with updates
    const tasks = props.onUpdateStorage();

    // add data to local storage
    /**
     * Set Item to local storage
     * @function setItem
     */
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [props, props.task, isEditing, styleTaskByStatus, filesList]);

  /**
   * Delete Task be clicking on Button Delete
   * @function deleteTaskHandler
   *
   */
  const deleteTaskHandler = () => {
    props.onDeleteTask(props.task.key);
  };

  /**
   * Go to edit mode in current task
   * @function editTaskHandler
   */
  const editTaskHandler = () => {
    setIsEditing(true);
  };

  /**
   * Exit editing mode without changes
   * @function exitEditModeHandler
   */
  const exitEditModeHandler = () => {
    setIsEditing(false);
  };

  // save changes in Task
  /**
   * Updating task
   * @param {string} task - Task key
   * @param {string} title - Task Title
   * @param {string} status - Task status
   * @param {string} description - Task description
   * @param {string} deadline - Task deadline
   * @param {Array} filesList - Files attached to current task
   */
  const saveChangesHandler = (
    task,
    title,
    status,
    description,
    deadline,
    filesList
  ) => {
    // update data in App js
    props.onChangeTask(task, title, status, description, deadline, filesList);

    // set styling for task based on status
    if (status === 'done') {
      setStyleTaskByStatus(classes.task__done);
    } else if (status === 'processed') {
      setStyleTaskByStatus(classes.task__processed);
    } else {
      setStyleTaskByStatus(classes.task__new);
    }

    // exit edit mode
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TaskEdit
        task={props.task}
        onExitEdit={exitEditModeHandler}
        onSaveChanges={saveChangesHandler}
      />
    );
  }
  return (
    <Fragment>
      <div className={`${classes.task} ${styleTaskByStatus} ${isOverdue}`}>
        <header>
          <div>
            <h2>{props.task.title}</h2>
            <p>{props.task.status}</p>
          </div>

          <div>
            <Button
              task={props.task}
              onClick={deleteTaskHandler}
              className={classes.delete__btn}
            >
              удалить
            </Button>
            <Button onClick={editTaskHandler} className={classes.edit__btn}>
              изменить
            </Button>
          </div>
        </header>

        {!!props.task.description && (
          <p className={classes.task__description}>{props.task.description}</p>
        )}

        <div className={classes.task__footer}>
          {!!filesList.length && (
            <ul>
              {filesList.map((file) => {
                return (
                  <li key={file.key}>
                    <a href={file.url} target='_blank' rel='noreferrer'>
                      {file.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {!filesList.length && <p>Нет файлов</p>}
          <span>до {props.task.date}</span>
        </div>
      </div>
    </Fragment>
  );
}
