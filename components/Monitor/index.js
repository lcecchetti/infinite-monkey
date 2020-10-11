import styles from 'styles/components/Monitor.module.scss';
import Terminal from 'components/Terminal';

const Monitor = (props) => (
    <div className={styles.monitor}>
        <div className={styles.screen}>
            <Terminal />
        </div>
    </div>
);

export default Monitor;