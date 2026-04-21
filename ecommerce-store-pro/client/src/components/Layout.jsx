import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastStack from './Toast';

export default function Layout() {
  const { toasts } = useSelector((state) => state.ui);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-base text-white">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastStack toasts={toasts} />
    </div>
  );
}
