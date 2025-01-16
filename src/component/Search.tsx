import { faMagnifyingGlass, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './search.module.css';

const Search: React.FC = () => {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.search}>
                <div className={styles.searchIcon}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='sm' color='gray' />
                </div>
                <input type='text' placeholder="Tìm kiếm" />
            </div>
            <button>
                <FontAwesomeIcon icon={faUserPlus} size='1x' color='gray' />
            </button>
            <button>
                <FontAwesomeIcon icon={faUsers} size='1x' color='gray' />
            </button>
        </div>
    );
}

export default Search;