import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { fadeInUp, staggerContainer } from '../utils/animations';

export default function Home() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 4 }));
  }, [dispatch]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <BadgeHero />
          <h1 className="text-4xl font-heading font-semibold leading-tight md:text-5xl">
            Neon-powered gadgets for the modern enclave explorer
          </h1>
          <p className="text-white/70 md:text-lg">
            E-Commerce Store Pro is a polished demo showcasing production-grade architecture,
            authentication, and a vibrant dark neon aesthetic. Explore the catalog to see how the
            full stack experience comes together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button as="a" href="#featured">Browse featured</Button>
            <Button variant="ghost" as="a" href="/catalog">
              View all products
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="glass-panel relative flex items-center justify-center overflow-hidden p-10">
            <motion.img
              src="https://picsum.photos/seed/hero-neon/640/480"
              alt="Neon product showcase"
              className="rounded-3xl object-cover shadow-neon"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-neon/20" />
          </div>
        </motion.div>
      </section>

      <section id="featured" className="space-y-8">
        <motion.h2 className="text-2xl font-semibold" variants={fadeInUp} initial="hidden" animate="visible">
          Featured products
        </motion.h2>
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {items.slice(0, 4).map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

function BadgeHero() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-neon/50 bg-neon/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-neon">
      <span>Live demo</span>
      <span className="h-1 w-1 rounded-full bg-neon" />
      <span>Full-stack</span>
    </div>
  );
}
