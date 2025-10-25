import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { createOrder } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2)
});

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal } = useSelector((state) => state.cart);
  const { status } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!items.length) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  const onSubmit = async (values) => {
    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      })),
      shippingAddress: values
    };

    const resultAction = await dispatch(createOrder(payload));
    if (createOrder.fulfilled.match(resultAction)) {
      dispatch(clearCart());
      dispatch(
        showToast({
          title: 'Order placed',
          message: 'Thank you for your purchase!',
          type: 'success'
        })
      );
      navigate('/profile');
    } else {
      dispatch(
        showToast({
          title: 'Checkout failed',
          message: resultAction.payload || 'Please try again',
          type: 'danger'
        })
      );
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr,0.6fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-4 p-6">
          <Input label="Full name" {...register('fullName')} helperText={errors.fullName?.message} />
          <Input label="Street" {...register('street')} helperText={errors.street?.message} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="City" {...register('city')} helperText={errors.city?.message} />
            <Input label="State" {...register('state')} helperText={errors.state?.message} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Postal code"
              {...register('postalCode')}
              helperText={errors.postalCode?.message}
            />
            <Input label="Country" {...register('country')} helperText={errors.country?.message} />
          </div>
          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Placing order...' : 'Place order'}
          </Button>
        </form>
        <aside className="glass-panel space-y-4 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="space-y-3 text-sm text-white/70">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.name}
                  <span className="text-white/40"> × {item.quantity}</span>
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 pt-3 text-sm text-white/60">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>Included</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-neon">
              <span>Total due</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
      {status === 'loading' && <Loader fullscreen label="Processing order" />}
    </div>
  );
}
