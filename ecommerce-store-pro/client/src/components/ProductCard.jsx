import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from './Badge';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0],
        quantity: 1
      })
    );
    dispatch(
      showToast({
        title: 'Added to cart',
        message: `${product.name} has been added to your cart`,
        type: 'success'
      })
    );
  };

  return (
    <motion.article
      className="glass-panel group flex flex-col gap-4 overflow-hidden"
      whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(0, 255, 255, 0.15)' }}
    >
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden rounded-2xl">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 px-2 pb-4">
        <div className="flex items-center justify-between">
          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </Badge>
          <span className="text-sm text-white/60">{product.category?.name}</span>
        </div>
        <Link to={`/product/${product.slug}`} className="text-lg font-semibold hover:text-neon">
          {product.name}
        </Link>
        <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-neon">
            ${Number(product.price).toFixed(2)}
          </span>
          <Button variant="secondary" disabled={product.stock === 0} onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
