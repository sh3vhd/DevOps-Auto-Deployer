import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import CategoryFilter from '../components/CategoryFilter';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { motion } from 'framer-motion';

export default function Catalog() {
  const dispatch = useDispatch();
  const { items, categories, pagination, status } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({ q: '', category: null, minPrice: '', maxPrice: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page,
      q: filters.q || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined
    };
    dispatch(fetchProducts(params));
  }, [dispatch, filters, page]);

  const isLoading = status === 'loading';

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    dispatch(
      fetchProducts({
        page: 1,
        q: filters.q || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined
      })
    );
  };

  const productsContent = useMemo(() => {
    if (isLoading) {
      return <Loader label="Fetching catalog" />;
    }

    if (!items.length) {
      return <p className="text-center text-white/60">No products match your filters yet.</p>;
    }

    return (
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {items.map((product) => (
          <motion.div key={product.id} variants={fadeInUp}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    );
  }, [isLoading, items]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Catalog</h1>
          <p className="text-white/60">
            Discover our curated collection of neon-inspired tech, fashion, and decor.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="glass-panel flex flex-col gap-4 p-6 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <Input
              label="Search"
              placeholder="Search by name"
              value={filters.q}
              onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <Input
              label="Min price"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
            />
            <Input
              label="Max price"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
            />
          </div>
          <Button type="submit" className="md:self-center">
            Apply filters
          </Button>
        </form>
        <CategoryFilter
          categories={categories}
          active={filters.category}
          onChange={(slug) => {
            setFilters((prev) => ({ ...prev, category: slug }));
            setPage(1);
          }}
        />
      </div>

      {productsContent}
      <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
    </div>
  );
}
