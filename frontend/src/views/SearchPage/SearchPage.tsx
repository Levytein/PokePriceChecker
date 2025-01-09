import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from './SearchPage.module.scss';
import { useLoading } from "../LoadingContext/LoadingProvider";
interface Card {
  id: string;
  images: { small: string };
  name: string;
  number: string;
  set: { printedTotal: string };
  rarity: string;
  artist: string;
  tcgplayer?: { prices: { [key: string]: { low?: number; market?: number; high?: number } } };
}

function SearchPage() {
  const { searchWord } = useParams();
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState("asc"); 

  const { startLoading, stopLoading } = useLoading();
  const [activeSort,setActiveSort] = useState(null);

  const [originalCards, setOriginalCards] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const cleanup = startLoading();
      try {
        const url = `http://localhost:6543/search/${searchWord}`;
        //console.log('Fetching URL:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        //console.log(data);
        setResults(data.cards.data);
        setOriginalCards(data.cards.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
        stopLoading();
      }
      cleanup();

    };

    fetchSearchResults();
  }, [searchWord]);
  const handleToggle = (itemName) =>
    {
        if(activeSort === itemName)
        {
          return;
        }
        setActiveSort((prev)=> (prev === itemName ? null : itemName))
    }
  const handleSortToggle = (itemName:string)=>
    {
      sortCards(itemName);
      handleToggle(itemName);
    }
    const handleSearch = (e) => {
      const searchValue = e.target.value.toLowerCase();
    
      if (searchValue === '') {
        // Reset to the original cards
        setResults(originalCards);
      } else {
        // Filter the original cards
        const filtered = originalCards.filter((card) =>
          card.name.toLowerCase().includes(searchValue)
        );
        setResults(filtered);
      }
    };
    const sortCards = (criterion: string) => {
      const sortedCards = [...results].sort((a, b) => {
        let comparison = 0;
    
        switch (criterion) {
          case "name":
            comparison = a.name.localeCompare(b.name); // Sort alphabetically
            break;
    
          case "price": {
            const getLowestPrice = (card: any) => {
              if (!card.tcgplayer?.prices) return 0;
              const priceFields = Object.keys(card.tcgplayer.prices);
              return priceFields.reduce((lowest, field) => {
                const price = card.tcgplayer.prices[field]?.low || 0;
                return Math.min(lowest, price);
              }, Infinity);
            };
    
            const aPrice = getLowestPrice(a);
            const bPrice = getLowestPrice(b);
            comparison = aPrice - bPrice; // Sort by lowest price
            break;
          }
    
          case "number":
            comparison = parseInt(a.number) - parseInt(b.number); // Sort numerically
            break;
    
          default:
            break;
        }
    
        // Reverse comparison if sorting in descending order
        return sortDirection === "asc" ? comparison : -comparison;
      });
    
      setResults(sortedCards);
      setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // Toggle direction
    };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
           <div className={styles.headerContainer}>
           <div className={styles.sortButtons}>
        <input className={styles.searchBar} onChange={handleSearch} type='text' placeholder="Search for a card here"/>
  <button onClick={() => {
    handleSortToggle('name');
    }} className={`${styles.sortButton} ${activeSort === 'name' ? styles.activeSortButton : ""} ${activeSort ==='name' && sortDirection ==='desc' ? styles.activeSortDesc: ''} ${activeSort ==='name' && sortDirection ==='asc'  ? styles.activeSortAsc: ''} `}>
      Name
      <div className={styles.sortArrow}>
        <i className={styles.arrowUp}></i>
        <i className={styles.arrowDown}></i>
      </div>
      </button>
  <button onClick={() => {
    handleSortToggle('price');
  }} className={`${styles.sortButton} ${activeSort === 'price' ? styles.activeSortButton : ""} ${ activeSort ==='price' && sortDirection ==='desc'  ? styles.activeSortDesc: ''}${activeSort ==='price' && sortDirection ==='asc'  ? styles.activeSortAsc: ''} `}>
    Price
    <div className={styles.sortArrow}>
        <i className={styles.arrowUp}></i>
        <i className={styles.arrowDown}></i>
      </div>
  </button>
  <button onClick={() => handleSortToggle('number')}
    className={`${styles.sortButton} ${activeSort === 'number' ? styles.activeSortButton : ""} ${activeSort ==='number' && sortDirection ==='desc'  ? styles.activeSortDesc: ''} ${activeSort ==='number' && sortDirection ==='asc'  ? styles.activeSortAsc: ''}`}
    > 
    Number
  <div className={styles.sortArrow}>
        <i className={styles.arrowUp}></i>
        <i className={styles.arrowDown}></i>
      </div>
  </button>
</div>

           </div>
          <h2>Results for {searchWord}</h2>
          <div className={styles.setCards}>
            {results.map((card) => (
              <div className={styles.cardSlot} key={card.id}>
                <img src={card.images.small} alt={card.name} />
                <div className={styles.cardInfo}>
                
                  <p className={styles.cardName}>{card.name}</p>
                  <div className={styles.cardSetInfo}>
                    <Link to={`/${card.set.name}/${card.set.id}`} >
                    <div className={styles.fromSet}>
                    <p>{card.set.name}, {card.number} / {card.set.printedTotal} , {card.rarity || "N/A"}</p>
                    </div>
                    </Link>
                    </div>
                  <div className={styles.artist}>
                    <label>Artist:</label>
                  <p className={styles.cardArtist}>{card.artist || "N/A"}</p>
                  </div>
    
                  {card.tcgplayer?.prices && (
                    <div className={styles.cardPrices}>
                      <label>Prices:</label>
                      {Object.keys(card.tcgplayer.prices).map((priceType) => (
                        <div key={priceType}>
                          <strong className={styles.priceHeading}>{priceType.charAt(0).toUpperCase() + priceType.slice(1)}:</strong>
                          <div className={styles.priceValues}>
                            <div className={styles.priceContainer}>
                              <label>Lowest:</label>
                              <p className={styles.priceLow}>${card.tcgplayer.prices[priceType]?.low || "N/A"}</p>
                            </div>
                            <div className={styles.priceContainer}>
                              <label>Market:</label>
                              <p className={styles.priceMarket}>${card.tcgplayer.prices[priceType]?.market || "N/A"}</p>
                            </div>
                            <div className={styles.priceContainer}>
                              <label>Highest:</label>
                              <p className={styles.priceHigh}>${card.tcgplayer.prices[priceType]?.high || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
