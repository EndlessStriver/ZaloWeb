import { faMagnifyingGlass, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './search.module.css';

interface SearchProps {
    isForcusSearch: boolean;
    setIsFocusSearch: React.Dispatch<React.SetStateAction<boolean>>;
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    isShowFormAddFriend: boolean;
    setIsShowFormAddFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<SearchProps> = (props) => {

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchLeft}>
                <div className={styles.searchIcon}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='sm' color='gray' />
                </div>
                <input
                    onFocus={() => props.setIsFocusSearch(true)}
                    onChange={(e) => props.setKeyword(e.target.value)}
                    value={props.keyword}
                    type='search'
                    placeholder="Tìm kiếm"
                />
            </div>
            <div className={styles.searchRight}>
                {
                    props.isForcusSearch ?
                        <button onClick={() => props.setIsFocusSearch(false)} className={styles.closeButton}>
                            <span>Đóng</span>
                        </button>
                        :
                        <>
                            <button onClick={() => props.setIsShowFormAddFriend(true)}>
                                <FontAwesomeIcon icon={faUserPlus} size='1x' color='gray' />
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faUsers} size='1x' color='gray' />
                            </button>
                        </>
                }
            </div>
        </div>
    );
}

export default Search;