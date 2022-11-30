import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import Button from '../UI/Button';
import classes from './TaskEdit.module.css';
import { LoadingFiles } from '../Helpers/LoadingFiles';
/**
 * Editing mode og task
 * @module TaskEdit
 */
export default function TaskEdit(props) {
  // create state for files list
  /**
   * Files attached to current task
   * @name currentFileList
   * @type {Array<object>}
   */
  const [currentFileList, setCurrentFileList] = useState(props.task.files);
  // state fot loading process
  /**
   * State for loading process
   * @name isLoading
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Changeable status state value for keeping current status in edit mode
   * @name statusValue
   * @type {string}
   */
  let statusValue;
  if (props.task.status === 'новое') {
    statusValue = 'new';
  } else if (props.task.status === 'в процессе') {
    statusValue = 'processed';
  } else {
    statusValue = 'done';
  }

  // editing refs from inputs

  const titleEditedRef = useRef();
  const statusEditedRef = useRef();
  const descriptionEditedRef = useRef();
  const deadlineEditedRef = useRef();

  // click cancel button to stop editing without saving changes
  const exitEditModeHandler = () => {
    props.onExitEdit();
  };

  // format date from props
  /**
   * @function formatDate
   * @returns {date} - Set deadline date
   */
  const formatDate = () => {
    return dayjs()
      .set('date', props.task.date.split('.')[0])
      .set('month', props.task.date.split('.')[1] - 1)
      .set('year', props.task.date.split('.')[2]);
  };
  /**
   * Formatted date for pasting in input[type='date']
   * @name deadline
   * @type {string}
   */
  const deadline = dayjs(formatDate()).format('YYYY-MM-DD');

  /**
   * Submit form to apply changes
   * @function submitChangesHandler
   * @param {SyntheticEvent} e - event from onChange
   */
  const submitChangesHandler = (e) => {
    e.preventDefault();

    /**
     * New Title
     * @name titleNew
     * @type {string}
     */
    const titleNew = titleEditedRef.current.value;

    /**
     * New status
     * @name statusNew
     * @type {string}
     */
    const statusNew = statusEditedRef.current.value;

    /**
     * New Description
     * @name descriptionNew
     * @type {string}
     */
    const descriptionNew = descriptionEditedRef.current.value;

    /**
     * New deadline
     * @name deadlineNew
     * @type {string}
     */
    const deadlineNew = deadlineEditedRef.current.value;

    props.onSaveChanges(
      props.task.key,
      titleNew,
      statusNew,
      descriptionNew,
      deadlineNew,
      currentFileList
    );
  };

  // UPDATE FILES IN CURRENT TASK
  /**
   * Update files in current task
   * @function updateFilesHandler
   * @param {SyntheticEvent} e - event from onChange event
   */
  const updateFilesHandler = (e) => {
    e.preventDefault(e);

    // variable for files add throuh input type file
    /**
     * FileList from input[type='file']
     * @name loadedFileList
     * @type {FileList}
     */
    const loadedFileList = e.target?.files; // return as FileList

    LoadingFiles(loadedFileList, setIsLoading, setCurrentFileList);
  };

  const deleteFileHandler = (e) => {
    e.preventDefault(e);

    // define file key of deleting file
    const fileToDelete = e.target.parentNode.attributes[0].nodeValue;

    // update Fileslist by filtering array
    setCurrentFileList((prevList) => {
      return prevList.filter((file) => file.key !== fileToDelete);
    });
  };
  return (
    <form onSubmit={submitChangesHandler} className={classes.form__edit}>
      <header>
        <input
          type='text'
          placeholder='Задача'
          defaultValue={props.task.title}
          ref={titleEditedRef}
          required
        />
        <select name='status' ref={statusEditedRef} defaultValue={statusValue}>
          <option value='new'>новое</option>
          <option value='processed'>в процессе</option>
          <option value='done'>выполнено</option>
        </select>
      </header>

      <textarea
        placeholder='Описание'
        defaultValue={props.task.description}
        className={classes.description__edit}
        ref={descriptionEditedRef}
      ></textarea>

      <div className={classes.form__labels}>
        <div>
          <label htmlFor='file-update' className={classes.file__label}>
            + файл
          </label>
          <input
            type='file'
            id='file-update'
            multiple
            onChange={updateFilesHandler}
          />
          {isLoading && <p className={classes.loading}>Загрузка...</p>}
        </div>

        <div className={classes.date__container}>
          <label htmlFor='date-label'>Выполнить до</label>
          <input
            id='date-label'
            type='date'
            defaultValue={deadline}
            ref={deadlineEditedRef}
            required
          />
        </div>
      </div>

      {!!currentFileList.length && (
        <ul className={`${classes.uploaded__files} ${props.className}`}>
          {currentFileList.map((item) => {
            return (
              <li
                key={item.key}
                filekey={item.key}
                className={classes.uploaded__file}
              >
                <a href={item.url} rel='noreferrer' target='_blank'>
                  {item.name}
                </a>{' '}
                <button onClick={deleteFileHandler}>{'\u2715'}</button>
              </li>
            );
          })}
        </ul>
      )}

      <div className={classes.form__actions}>
        <Button className={classes.cancel__btn} onClick={exitEditModeHandler}>
          отменить
        </Button>
        <Button type='submit' className={classes.save__btn}>
          сохранить
        </Button>
      </div>
    </form>
  );
}
