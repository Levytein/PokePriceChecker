import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Homepage from './views/Homepage/Homepage'
import Setpage from './views/Setpage/Setpage'
import Navbar from './views/Navbar/Navbar';
import './App.scss'
import Searchbar from './views/SearchBar/Searchbar';
import SearchPage from './views/SearchPage/SearchPage';
function App() {

  


  

  return (
    <BrowserRouter>
      <Navbar />
      <div className='containerR'>
      <Searchbar />
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/:series/:setId" element={<Setpage />} />
      <Route path="/search/:searchWord" element={<SearchPage />} />
      </Routes>
      </div>
    </BrowserRouter>
   
  );
}

export default App
