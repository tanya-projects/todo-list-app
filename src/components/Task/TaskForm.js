import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import Button from '../UI/Button';
import classes from './TaskForm.module.css';
import { LoadingFiles } from '../Helpers/LoadingFiles';

/**
 * TaskForm component
 * @module TaskForm
 */
export default function TaskForm(props) {
  // state for file list for current task
  const [fileList, setFileList] = useState([]);
  // variable for loading process
  const [isLoading, setIsLoading] = useState(false);

  // create refs for accessing inputs value
  const taskTitleRef = useRef();
  const taskDescriptionRef = useRef();
  const taskDateRef = useRef();

  // set default value for date input as tomorrow
  const defaultDateTill = dayjs().add(1, 'day').format('YYYY-MM-DD');

  // ADD FILES
  const addFilesHandler = (e) => {
    e.preventDefault();

    // variable for files add through input type file
    const loadedFileList = e.target?.files; // return as FileList

    LoadingFiles(loadedFileList, setIsLoading, setFileList);
  };

  // Delete file from list
  const deleteFileHandler = (e) => {
    e.preventDefault();
    // define file key of deleting file
    const fileToDelete = e.target.parentNode.attributes[0].nodeValue;

    // update Fileslist by filtering array
    setFileList((prevList) => {
      return prevList.filter((file) => file.key !== fileToDelete);
    });
  };

  // SUBMIT FORM for adding new task
  const addTaskHandler = (event) => {
    event.preventDefault();

    // create variables with current input data
    const taskTitle = taskTitleRef.current.value;
    const taskDescription = taskDescriptionRef.current.value;
    const taskDate = taskDateRef.current.value;

    // add inputed values into tasklist variable in App
    props.onAddTask(taskTitle, taskDescription, taskDate, fileList);

    // reset input values
    taskTitleRef.current.value = '';
    taskDescriptionRef.current.value = '';
    taskDateRef.current.value = defaultDateTill;
    setFileList([]);
  };

  return (
    <form className={classes.form} onSubmit={addTaskHandler}>
      <header>
        <input type='text' placeholder='Задача' ref={taskTitleRef} required />
        <Button className={classes.button} type='submit'>
          + Добавить
        </Button>
      </header>

      <textarea placeholder='Описание' ref={taskDescriptionRef}></textarea>

      <div className={classes.labels}>
        <div>
          <label htmlFor='file' className={classes.file__label}>
            + файл
          </label>
          <input type='file' id='file' multiple onChange={addFilesHandler} />
          {isLoading && <p className={classes.loading}>Загрузка...</p>}
        </div>

        <div>
          <label htmlFor='date-till'>Выполнить до</label>
          <input
            id='date-till'
            type='date'
            ref={taskDateRef}
            defaultValue={defaultDateTill}
            required
          />
        </div>
      </div>

      {!!fileList.length && (
        <ul className={`${classes.uploaded__files} ${props.className}`}>
          {fileList.map((item) => {
            return (
              <li key={item.key} filekey={item.key}>
                <a href={item.url} rel='noreferrer' target='_blank'>
                  {item.name}
                </a>
                <button onClick={deleteFileHandler}>{'\u2715'}</button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}
