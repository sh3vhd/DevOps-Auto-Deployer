import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import { logoutUser } from '../store/slices/authSlice';
import { selectCart } from '../store';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/cart', label: 'Cart' }
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector(selectCart);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-neon">
          {__APP_NAME__}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-neon ${isActive ? 'text-neon' : 'text-white/70'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-white/70'}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative">
            <span className="text-2xl" role="img" aria-label="Shopping cart">
              🛒
            </span>
            {cart.items.length > 0 && (
              <span className="absolute -right-2 -top-1 rounded-full bg-accent px-2 text-xs font-semibold text-base">
                {cart.items.length}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-white/70 md:inline">
                {user.email}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
