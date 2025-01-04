import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Homepage from './views/Homepage/Homepage'
import Setpage from './views/Setpage/Setpage'
import Navbar from './views/Navbar/Navbar';
import './App.scss'
function App() {

  


  

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/:series/:setId" element={<Setpage />} />
      </Routes>

    </BrowserRouter>
   
  );
}

export default App
