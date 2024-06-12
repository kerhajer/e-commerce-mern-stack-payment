import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import AdminPanel from './pages/AdminPanel';
import AllUsers from './pages/Allusers';
import ChangeUserRole from './pages/ChangeUserRole';
import AllProducts from './pages/AllProducts';
import AdminEditProduct from './pages/AdminEditProduct';
import CategoryProduct from './pages/CategoryProduct';
import ProductDetails from './pages/ProductDetails';
import SearchProduct from './pages/SearchProduct';
import Cart from './pages/Cart';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Allcarts from './pages/Allcarts'
import Order from './pages/Order'
export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
       
       
        <Route path="/admin-panel" element={<AdminPanel />}>
          <Route path="allusers" element={<AllUsers />} />
          <Route path="random" element={<AllProducts />} />
          <Route path="allorder" element={<Allcarts/>}/>

        </Route>
        <Route path="/admin-panel/allusers/:id" element={<ChangeUserRole />} />
        <Route path="/admin-panel/random/:idPRODUCT" element={<AdminEditProduct/>} />
        <Route path="/product-category" element={<CategoryProduct/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/search" element={<SearchProduct/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/cart/update/:id" element={<Cart/>} />
        <Route path="/success" element={<Success/>}/>
      <Route path="/cancel" element={<Cancel/>}/>
      
      <Route path="/order" element={<Order/>}/>

      </Routes>
    </BrowserRouter>
  );
}