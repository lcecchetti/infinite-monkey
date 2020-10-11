import styles from 'styles/components/Terminal.module.scss';

const Terminal = (props) => (
    <div className={styles.terminal}>
      <span className={styles.output}>Lorem ipsum <br/>dolor sit amet</span>
    </div>
);

export default Terminal;