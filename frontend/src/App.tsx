import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { useState } from 'react';
import Homepage from './views/Homepage/Homepage'
import Setpage from './views/Setpage/Setpage'
import Navbar from './views/Navbar/Navbar';
import styles from './App.module.scss';
import Searchbar from './views/SearchBar/Searchbar';
import SearchPage from './views/SearchPage/SearchPage';
import LoadingBar from './views/LoadingContext/LoadingBar';
import { LoadingProvider } from './views/LoadingContext/LoadingProvider';
function App() {
      const [isHidden, setIsHidden] = useState(true);
  

      const toggleNavbar = () => {
        setIsHidden((prev) => !prev);
      };
  

  return (
    <LoadingProvider>
      <BrowserRouter>
        <LoadingBar />
        <Navbar isHidden={isHidden} toggleNavbar={toggleNavbar} />
        <div className={`${styles.containerR} ${isHidden ? styles.navBarActive : styles.navBarInactive}`}>
          <Searchbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/:series/:setId" element={<Setpage />} />
            <Route path="/search/:searchWord" element={<SearchPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App
