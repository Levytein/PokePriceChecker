
import styles from './Searchbar.module.scss'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Searchbar (){
    const [searchWord,setSearchWord] = useState("");
    const navigate = useNavigate();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('Key Pressed:', e.key);
            if (searchWord.trim() !== '') {
                console.log('Navigating to:', `/search/${searchWord.trim()}`);
                navigate(`/search/${searchWord.trim()}`);
            } else {
                console.log('Search word is empty');
            }
        }
    };
    return (
        <div className={styles.searchBar} >
            <input type='text' value={searchWord} onChange={(e) => setSearchWord(e.target.value)}
            onKeyDown={handleKeyPress}
             placeholder='Search for a card'/>
            <p className={styles.searchBarText}>Looking for a specific card?</p>
        </div>
    )
}

export default Searchbar;