import { useState,useEffect } from "react"
import { useParams } from "react-router-dom";
import { useLoading } from "../LoadingContext/LoadingProvider";

import styles from './Setpage.module.scss'
interface Card {
  id: string;
  images: { small: string };
  name: string;
  number: string;
  set: { name: string; printedTotal: string };
  rarity: string;
  artist: string;
  tcgplayer?: { prices: { [key: string]: { low?: number; market?: number; high?: number } } };
}

function Setpage () {
    const {setId } = useParams();
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortDirection, setSortDirection] = useState("asc"); 
    const { startLoading, stopLoading } = useLoading();
    const [activeSort, setActiveSort] = useState<string | null>(null);

    const [originalCards, setOriginalCards] = useState<Card[]>([]);
    interface SetInfo {
      name: string;
      releaseDate: string;
      series: string;
      printedTotal: number;
      total: number;
      images: { logo: string };
    }
    
    const [setInfo, setInformationForSet] = useState<SetInfo | null>(null);
    useEffect(() => {
        async function fetchCards() {
          const cleanup = startLoading();
          try {
            const response = await fetch(`https://localhost:6543/cards/${setId}`);
            const data = await response.json();
     
            setCards(data.cards.data || []);
            setOriginalCards(data.cards.data || []);

            if (!setInfo)
              {
                setInformationForSet(data.cards.data[0].set);
              } 
    
      
          } catch (error) {
            console.error('Error fetching cards:', error);
          } finally {
            setLoading(false);
            stopLoading();
          }
          cleanup();
        }
      
        fetchCards();
      }, [setId]);
      
      const handleSortToggle = (itemName:string)=>
      {
        sortCards(itemName);
        handleToggle(itemName);
      }
      const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              const getLowestPrice = (card: Card) => {
                if (!card.tcgplayer?.prices) return 0;
                const priceFields = Object.keys(card.tcgplayer.prices);
                return priceFields.reduce((lowest, field) => {
                  const price = card.tcgplayer?.prices[field]?.low || 0;
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

      const handleToggle = (itemName:string) =>
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
          <label>Released:</label>
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
         <img src={card.images.small} alt={card.name} />
         <div className={styles.cardInfo}>
         
           <p className={styles.cardName}>{card.name}</p>
           <div className={styles.cardSetInfo}>
             <div className={styles.fromSet}>
             <p>{card.set.name}, {card.number} / {card.set.printedTotal} , {card.rarity || "N/A"}</p>
             </div>
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
              <strong>{priceType.charAt(0).toUpperCase() + priceType.slice(1)}:</strong> 
              <div className={styles.priceValues}>
              <div className={styles.priceContainer}>
              <label>Lowest:</label>
              <p className={styles.priceLow}>${card.tcgplayer?.prices[priceType]?.low || "N/A"}</p>
              </div>
              <div className={styles.priceContainer}>
              <label>Market:</label>
              <p className={styles.priceMarket}>${card.tcgplayer?.prices[priceType]?.market || "N/A"}</p>

              </div>
              <div className={styles.priceContainer}>
              <label>Highest:</label>
              <p className={styles.priceHigh}>${card.tcgplayer?.prices[priceType]?.high || "N/A"}</p>
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