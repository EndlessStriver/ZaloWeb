import { useContext, useEffect } from 'react';
import { NotifyContext } from '../context/NotifyContext';
import styles from './notify.module.css'

const Notify: React.FC = () => {

    const { notify, dispatch } = useContext(NotifyContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (notify !== null) {
                dispatch({ type: 'clear', payload: '' });
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [notify, dispatch]);

    if (!notify) return null;

    return (
        <div className={`${styles.container} ${notify.type === 'success' ? styles.success : notify.type === 'error' ? styles.error : styles.info}`}>
            <p className={`${styles.lable} ${notify.type === 'success' ? styles.success : notify.type === 'error' ? styles.error : styles.info}`}>
                {notify.type === 'success' ? 'Thành công' : notify.type === 'error' ? 'Lỗi' : 'Thông tin'}
            </p>
            <p className={styles.content}>{notify.text}</p>
        </div>
    );
}

export default Notify;