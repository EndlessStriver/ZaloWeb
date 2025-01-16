import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './resultSearch.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ResultSearch: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.noResultSearch}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faSearch} size='3x' color="#74b9ff" />
                </div>
                <span className={styles.lable}>Chưa có kết quả tìm kiếm?</span>
            </div>
        </div>
    )
}

export default ResultSearch;