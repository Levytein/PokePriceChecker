import styles from './Navbar.module.scss'
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
function Navbar ({isHidden,toggleNavbar}) {
    const [sets, setSets] = useState([]);
    const [cards,setCards] = useState([]);
    const [series,setSeries] = useState([]);
    const [activeSerie,setActiveSerie] = useState(null);
    useEffect(() => {
        async function fetchSets() {
          try {
            console.log('Fetching data...');
            const response = await fetch('http://localhost:6543/sets');
            const data = await response.json();
            if (data.sets && Array.isArray(data.sets)) {
              setSets(data.sets);
              const uniqueSeries = data.sets
                .map((item) => item.series)
                .filter((series, index, self) => self.indexOf(series) === index);
              setSeries(uniqueSeries);
            } else {
              console.warn('Unexpected data structure:', data);
            }
          } catch (error) {
            console.error('Error fetching sets:', error);
          }
        }
    
        fetchSets();
      }, []);

      const getSetsBySeries = (seriesName:string) =>
      {
        return sets.filter((sets) => sets.series === seriesName)
      }
      const fetchSetCards = async (setID:string) =>
        {
          try{
            const response = await fetch(`http://localhost:5000/cards/${setID}`);
            const data = await response.json();
            console.log("Fetched the card",data);
            setCards(data.cards || []);
      
          }
          catch(error){
            console.error("error fetching cards",error);
          }
        }
     
        const handleToggle = (itemName) =>
        {
            setActiveSerie((prev)=> (prev === itemName ? null : itemName))
        }
        const handleNavBar = () =>
          {
            toggleNavbar((prev) => !prev);
          }

          return (
            <div className={`${styles.navContainer} ${isHidden ? styles.activeNavBar : styles.inactiveNavBar} `}>
              <button onClick={handleNavBar} className={styles.controlButton}><i className={styles.bigArrow}></i></button>
           
              <div className={styles.listContainer}>
              <h1 className={styles.navHeader}>PokeCheck</h1>
              <ul className={styles.seriesList}>
                {series.map((serie, index) => (
                  <li key={index}>
                    <div className={`${styles.seriesContainer}  ${activeSerie === serie ? styles.active :''} `}
                      key={serie}
                      onClick={()=> handleToggle(serie)}>
                        <div className={styles.seriesNameText} >
                        <p>{serie}</p>
                        <button><i className={styles.arrow}></i></button>
                        </div>
               
                    <div className={styles.listSets}>
                      <div className={styles.listContainer}>
                        <ul>
                    {getSetsBySeries(serie).map((set) => {
                        const cleanedString = set.series.replace(/\s+/g, '');
                    
                        return (<Link to={`/${cleanedString}/${set.id}`} >
                        <li key={set.id}>{set.name}</li>
                        </Link>)
                        })}
                    </ul>
                    </div>
                    </div>
                    </div>
                    </li>
                ))}
              </ul>
              </div>
            </div>
          );
        }
     /*const cleanedString = set.series.replace(/\s+/g, '');
        return (
          <div className={styles.setContainer} key={set.id}>
       
          <div className={styles.setImg} id={set.id} ><img src={set.images.logo}></img></div>
          </Link>
      )*/
export default Navbar;