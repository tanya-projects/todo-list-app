import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import Header from './components/Layout/Header';
import TaskForm from './components/Task/TaskForm';
import TaskList from './components/Task/TaskList';
import Footer from './components/Layout/Footer';
import { StyleTextTitle } from './components/Helpers/StyleTextTitle';

/**
 * App
 * @module App
 */
function App() {
  /**
   * Set Today date
   * @type {string}
   * @name today
   */
  //
  const today = dayjs().format('DD.MM.YYYY');

  // set task list as empty list or retrieve data from local storage
  const [taskList, setTaskList] = useState(() => {
    // check if we have tasks data on local storage: if yes, then retrieve this data and load
    /**
     * User Tasks - get from Local storage or set as empty Array
     * @type {Array}
     * @name userTasks
     */
    const userTasks = localStorage.getItem('tasks');
    if (userTasks) {
      return JSON.parse(userTasks);
    } else {
      return [];
    }
  });

  // if no task presents then delete tasks item from localstorage
  if (!taskList.length) {
    localStorage.removeItem('tasks');
  }

  // add task
  const addTaskHandler = (title, description, date, files) => {
    // format date input
    const formattedDateTill = dayjs(date).format('DD.MM.YYYY');

    // create variable with created date and time for unique task id
    const createdDateUniseconds = dayjs().unix();

    // add new item in tasklist array as object (all new tasks have status of new, priority depends on status - need this for sort task by status: new task should be on top)
    setTaskList((prevTaskList) => {
      return [
        ...prevTaskList,

        {
          key: `id_${createdDateUniseconds}`,
          title: StyleTextTitle(title),
          description: description,
          date: formattedDateTill,
          status: 'новое',
          files: files,
          priority: 3,
        },
      ];
    });
  };

  const deleteCurrentTaskHandler = (taskKey) => {
    setTaskList((prevTaskList) => {
      // exclude item by filtering task list array based on inequality of key of current clicked task
      const updatedList = prevTaskList.filter((item) => item.key !== taskKey);
      return updatedList;
    });
  };

  const changeTaskHandler = (
    taskKey,
    title,
    status,
    description,
    deadline,
    fileList
  ) => {
    // find task we edit
    const editedTask = taskList.find((item) => item.key === taskKey);

    // change field in editing task
    editedTask.title = StyleTextTitle(title);

    if (status === 'processed') {
      editedTask.status = 'в процессе';
      editedTask.priority = 2;
    } else if (status === 'done') {
      editedTask.status = 'выполнено';
      editedTask.priority = 1;
    } else {
      editedTask.status = 'новое';
      editedTask.priority = 3;
    }

    editedTask.description = description;
    editedTask.date = dayjs(deadline).format('DD.MM.YYYY');
    editedTask.files = fileList;
  };

  return (
    <Fragment>
      <Header today={today} />
      <TaskForm today={today} onAddTask={addTaskHandler} tasks={taskList} />
      <TaskList
        tasks={taskList}
        onDeleteTask={deleteCurrentTaskHandler}
        onChangeTask={changeTaskHandler}
      />
      <Footer />
    </Fragment>
  );
}
export default App;
