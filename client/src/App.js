import './App.css';
import Navbar from './components/header/Navbar';
import Newnav from './components/Newnavbaar/Newnav';
import Maincomponent from './components/home/Maincomponent';
import Footer from './components/footer/Footer';
import SignUp from './components/signup_sign/SignUp';
import Sign_in from './components/signup_sign/Sign_in';
import { Routes, Route } from 'react-router-dom';
import Cart from './components/cart/Cart';
import Buynow from './components/buynow/Buynow';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(true)
    }, 2000)
  }, []);

  return (
    <>
      {
        data ? (
          <>
            <Navbar />
            <Newnav />
            <Routes>
              <Route path='/' element={< Maincomponent />}></Route>

              <Route path='/login' element={<Sign_in />}></Route>

              <Route path='/register' element={<SignUp />}></Route>

              <Route path='/getproductsone/:id' element={<Cart />} ></Route>
              {/* <Route path='/buynow' element={<Buynow />} ></Route> */}
              <Route path='/buynow' element={<Buynow />}></Route>

            </Routes>
            <Footer />
          </>
        ) : (
          <div className='circle'>
            <CircularProgress/>
            <h2>Loading...</h2>
          </div>
        )
    }

    </>
  );
}

export default App;
