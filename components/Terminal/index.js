import styles from 'styles/components/Terminal.module.scss';
import MonkeyOutput from 'components/MonkeyOutput';

const Terminal = (props) => (
    <div className={styles.terminal}>
        <MonkeyOutput/>
    </div>
);

export default Terminal;