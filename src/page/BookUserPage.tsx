import React from 'react'
import styles from './bookUserPage.module.css'
import Search from '../component/Search';
import GroupAndFriend from '../component/GroupAndFriend';
import ResultSearch from '../component/ResultSearch';

const BookUserPage: React.FC = () => {

    const [isFocusSearch, setIsFocusSearch] = React.useState<boolean>(false);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Search isForcusSearch={isFocusSearch} setIsFocusSearch={setIsFocusSearch} />
                {
                    !isFocusSearch ? <GroupAndFriend /> : <ResultSearch />
                }
            </div>
            <div className={styles.content}>

            </div>
        </div>
    );
}

export default BookUserPage;