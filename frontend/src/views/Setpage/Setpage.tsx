import { useState,useEffect } from "react"
import { useParams,useLocation } from "react-router-dom";
import styles from './Setpage.module.scss'
function Setpage () {
    const {setId } = useParams();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortDirection, setSortDirection] = useState("asc"); 

    const [activeSort,setActiveSort] = useState(null);

    const [originalCards, setOriginalCards] = useState([]);
    const [setInfo,setInformationForSet] = useState({});
    useEffect(() => {
        async function fetchCards() {
          try {
            const response = await fetch(`http://localhost:6543/cards/${setId}`);
            const data = await response.json();
     
            setCards(data.cards.data || []);
            setOriginalCards(data.cards.data || []);

            if(setInfo.set === undefined)
              {
                setInformationForSet(data.cards.data[0].set);
              } 
    
      
          } catch (error) {
            console.error('Error fetching cards:', error);
          } finally {
            setLoading(false);
          }
        }
      
        fetchCards();
      }, [setId]);
      
      const handleSortToggle = (itemName:string)=>
      {
        sortCards(itemName);
        handleToggle(itemName);
      }
      const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
      
        if (searchValue === '') {
          // Reset to the original cards
          setCards(originalCards);
        } else {
          // Filter the original cards
          const filtered = originalCards.filter((card) =>
            card.name.toLowerCase().includes(searchValue)
          );
          setCards(filtered);
        }
      };
      const sortCards = (criterion: string) => {
        const sortedCards = [...cards].sort((a, b) => {
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
      
        setCards(sortedCards);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // Toggle direction
      };

      const handleToggle = (itemName) =>
        {
            if(activeSort === itemName)
            {
              return;
            }
            setActiveSort((prev)=> (prev === itemName ? null : itemName))
        }
   return (
    <div className={styles.container}>
      
      <div className={styles.headerContainer}>
        {loading && <h1>Loading...</h1>}
        {!loading &&setInfo &&  (
          <>
           <img className ={styles.setImage} src={setInfo.images.logo}></img>
        <div className={styles.setInformation}>
          <div className={styles.setInfoText}>
          <label>Set Name:</label>
          <p className={styles.setHeader}>{setInfo.name}</p>
          </div>
          <div className={styles.setInfoText}>
          <label>Release Date:</label>
          <p className={styles.setHeader}>{setInfo.releaseDate}</p>
          </div>
          <div className={styles.setInfoText}>
          <label>Series:</label>
          <p className={styles.setHeader}>{setInfo.series}</p>         
          </div>
          <div className={styles.setInfoText}>
          <label>Total amount of cards:</label>
        <p className={styles.setHeader}>Cards: {setInfo.printedTotal} Secrets:{setInfo.total - setInfo.printedTotal}</p>
        </div>
        </div>
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
      </>
      )}
      </div>


      <div className ={styles.setCards}>
        {cards.map((card) => (
            <div className={styles.cardSlot} key={card.id}> 
            <img src={card.images.small}></img>
            <div className={styles.cardInfo}>
              <label>Name:</label>
            <p className={styles.cardName}>{card.name}</p>
            <label>Number in Set:</label>
            <p className={styles.cardNumber}>{card.number} / {card.set.printedTotal}</p>
            <label>Rarity:</label>
            <p className={styles.cardRarity}>{card.rarity}</p>
            <p className={styles.cardArtist}>{card.artist}</p>
            {card.tcgplayer?.prices && (
        <div className={styles.cardPrices}>
          <label>Prices:</label>
          {Object.keys(card.tcgplayer.prices).map((priceType) => (
            <div key={priceType}>
              <strong>{priceType.charAt(0).toUpperCase() + priceType.slice(1)}:</strong> 
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
    </div>
  );

}

export default Setpage;