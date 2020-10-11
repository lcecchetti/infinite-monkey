import {useEffect, useState} from 'react';
import styles from 'styles/components/Terminal.module.scss';
import Monkey from 'lib/monkey';
import MonkeyOutput from "../MonkeyOutput";

// a monkey
var monkey = Monkey();

// monkey target
var target = 'Lorem ipsum dolor sit amet';

const Terminal = () => {
  return (
    <div className={styles.terminal}>
      <div className={styles.output}>
        <h1>🐒 Infinite Monkey Corp ©</h1>
        <MonkeyOutput target={target}/>
      </div>
    </div>
  );
};


export default Terminal;