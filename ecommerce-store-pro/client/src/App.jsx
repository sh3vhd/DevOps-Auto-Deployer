import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import LoginRegister from './pages/LoginRegister';
import { refreshSession } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && status === 'idle') {
      dispatch(refreshSession());
    }
  }, [dispatch, user, status]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:slug" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute requiresAdmin />}>
          <Route path="admin" element={<Profile adminView />} />
        </Route>
        <Route path="login" element={<LoginRegister />} />
      </Route>
    </Routes>
  );
}
