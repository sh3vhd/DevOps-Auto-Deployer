import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProduct, clearCurrentProduct } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';
import { formatCurrency } from '../utils/formatters';

export default function Product() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { currentProduct, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(clearCurrentProduct());
    dispatch(fetchProduct(slug));
  }, [dispatch, slug]);

  if (status === 'loading' || !currentProduct) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading product" />
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: currentProduct.id,
        name: currentProduct.name,
        price: Number(currentProduct.price),
        image: currentProduct.images?.[0],
        quantity: 1
      })
    );
    dispatch(
      showToast({
        title: 'Added to cart',
        message: `${currentProduct.name} has been added to your cart`,
        type: 'success'
      })
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Catalog', to: '/catalog' },
          { label: currentProduct.name }
        ]}
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <motion.div
          className="glass-panel overflow-hidden"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img
            src={currentProduct.images?.[0]}
            alt={currentProduct.name}
            className="w-full rounded-3xl object-cover"
          />
        </motion.div>
        <div className="space-y-6">
          <Badge variant={currentProduct.stock > 0 ? 'success' : 'danger'}>
            {currentProduct.stock > 0 ? 'In stock' : 'Out of stock'}
          </Badge>
          <h1 className="text-3xl font-semibold">{currentProduct.name}</h1>
          <p className="text-white/70">{currentProduct.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-neon">
              {formatCurrency(Number(currentProduct.price))}
            </span>
            <span className="text-sm text-white/60">
              Category: {currentProduct.category?.name}
            </span>
          </div>
          <Button
            variant="secondary"
            disabled={currentProduct.stock === 0}
            onClick={handleAddToCart}
            className="w-full md:w-auto"
          >
            Add to cart
          </Button>
          <div className="glass-panel space-y-2 p-6">
            <h2 className="text-lg font-semibold">Why you will love it</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-white/70">
              <li>Crafted with neon-forward design principles.</li>
              <li>Seamless integration with smart home ecosystems.</li>
              <li>Built on top of a fully documented REST API.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
