import React from 'react';
import classes from './Header.module.css';

export default function Header(props) {
  return (
    <header className={classes.header}>
      <h1 className={classes.title}>TODO лист</h1>
      <span className={classes.today}>{props.today}</span>
    </header>
  );
}
