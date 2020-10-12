import {useEffect, useState} from 'react';
import styles from 'styles/components/Terminal.module.scss';
import Monkey from 'lib/monkey';
import MonkeyEssay from "../MonkeyEssay";
import masterpiece from "lib/masterpiece";

// a monkey
var monkey = new Monkey(masterpiece, .95);

// monkey target
var target = 'Lorem ipsum dolor sit amet';

const Terminal = () => {
  return (
    <div className={styles.terminal}>
      <div className={styles.output}>
        <h1 className={styles.logo}>🐒 Infinite Monkey Corp ©</h1>
        <MonkeyEssay monkey={monkey}/>
      </div>
    </div>
  );
};


export default Terminal;