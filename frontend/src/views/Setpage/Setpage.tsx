import { useState,useEffect } from "react"
import { useParams,useLocation } from "react-router-dom";
import styles from './Setpage.module.scss'
function Setpage () {
    const { series,setId } = useParams();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchCards() {
          try {
            const response = await fetch(`http://localhost:5000/cards/${setId}`);
            const data = await response.json();
            console.log(data);
            setCards(data.cards.data || []);
          } catch (error) {
            console.error('Error fetching cards:', error);
          } finally {
            setLoading(false);
          }
        }
      
        fetchCards();
      }, [setId]);
      
  
   
   return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        {loading ? <h1>Loading...</h1>:''}
        {!loading && <>
           <img className ={styles.setImage}src={cards[0].set.images.logo}></img>
      <h1 className={styles.setHeader}>{cards[0].set.name}</h1>
      </>
      }
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
            <p key={priceType}>
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
            </p>
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