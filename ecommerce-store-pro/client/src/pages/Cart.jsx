import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { formatCurrency } from '../utils/formatters';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, subtotal } = useSelector((state) => state.cart);

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity: Number(quantity) }));
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-white/70">
        <p>Your cart is empty. Start exploring our catalog!</p>
        <Button as={Link} to="/catalog">
          Browse catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Shopping cart</h1>
        <Button variant="ghost" onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </div>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="glass-panel flex flex-col gap-4 p-6 md:flex-row md:items-center">
            <img
              src={item.image}
              alt={item.name}
              className="h-28 w-28 rounded-2xl object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <span className="text-sm text-white/60">{formatCurrency(item.price)}</span>
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm text-white/60">
                  Quantity
                  <input
                    className="focus-ring ml-2 w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                  />
                </label>
                <Button variant="ghost" onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 glass-panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/60">Subtotal</p>
          <p className="text-2xl font-semibold text-neon">{formatCurrency(subtotal)}</p>
        </div>
        <Button as={Link} to="/checkout" className="md:w-auto">
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}
