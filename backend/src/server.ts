import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs, { read } from 'fs';
import axios from 'axios';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 6543;
const cachedFile = 'cachedCards.json';
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.ALLOWED_ORIGIN
  : 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.static(path.join(__dirname, '')));

async function fetchCards() {
    try {
      const response = await axios.get('https://api.pokemontcg.io/v2/sets', {
        headers: { 'X-Api-Key': process.env.HAMBURGER },
        params: {   
          page: 1,        
          orderBy: '-releaseDate', 
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching cards:', error.message);
      throw error;
    }
  }
  app.get('/search/:searchWord', async (req: Request, res: Response) => {
    const { searchWord } = req.params;

    try {
      let cards;
      const url = `https://api.pokemontcg.io/v2/cards?q=name:${searchWord}`;
      //console.log('Sending request to API:', url);
      const response = await axios.get(url);
      cards = response.data;
      res.json({ cards });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching data from Pokémon API:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
      res.status(500).json({ error: 'Failed to fetch data from Pokémon API' });
    }
  });
  app.get('/:series/:setID',async(req:Request, res: Response) =>{
    const {setID} = req.params;
    try {
      let cards;
      const response = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
        headers: { 'X-Api-Key': process.env.HAMBURGER },
        params: {
          q:`set.id:${setID}`,     
          page: 1,        
          orderBy: '-releaseDate', 
        },
      });
      cards = response.data;
      res.json({cards});
    } catch (error: any) {
      console.error('Error fetching cards:', error.message);
      throw error;
    }
  });

  function readCachedData() {
    if (fs.existsSync(cachedFile)) {
      console.log('Found cached data');
      try {
        const cachedData = JSON.parse(fs.readFileSync(cachedFile, 'utf-8'));
        console.log("returning cached data");
        return cachedData.data || cachedData; 
      } catch (error) {
        console.error('Error parsing cached data:', error);
        return null;
      }
    }
    return null;
  }
function saveDataToCache(data: any) {
  console.log('Saving data locally');
  const cards = data.data || data; 
  fs.writeFileSync(cachedFile, JSON.stringify(cards, null, 2), 'utf-8');
}


app.get('/sets', async (req, res) => {
    try {
      let sets ;
  
      if (!Array.isArray(sets)) {
        console.warn('Cached data is not an array. Fetching fresh data...');
        const fetchedData = await fetchCards();
        sets = fetchedData.data || fetchedData; // Ensure it's an array
// Save back to cache
      }
      res.json({sets}); // Send the array to the frontend
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ error: 'Failed to fetch sets' });
    }
  });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(process.env.ALLOWED_ORIGIN);
  console.log(`🚀 Server is running on https://localhost:${PORT}`);
});
