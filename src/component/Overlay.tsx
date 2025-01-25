import styles from './Overlay.module.css';

interface OverlayProps {
    children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default Overlay;