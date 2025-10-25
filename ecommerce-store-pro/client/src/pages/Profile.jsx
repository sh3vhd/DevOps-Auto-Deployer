import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/ordersSlice';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { api } from '../api/axios';
import Input from '../components/Input';
import { showToast } from '../store/slices/uiSlice';

const statusVariants = {
  PENDING: 'warning',
  PAID: 'success',
  SHIPPED: 'default',
  DELIVERED: 'success',
  CANCELED: 'danger'
};

export default function Profile({ adminView = false }) {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [adminData, setAdminData] = useState({ orders: [], products: [], categories: [] });
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: ''
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' });

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (adminView && user?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [adminView, user]);

  const loadAdminData = async () => {
    try {
      setLoadingAdmin(true);
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/admin/products'),
        api.get('/admin/categories')
      ]);
      setAdminData({
        orders: ordersRes.data.data.items || ordersRes.data.data,
        products: productsRes.data.data.items || productsRes.data.data,
        categories: categoriesRes.data.data
      });
    } catch (error) {
      dispatch(
        showToast({
          title: 'Admin data error',
          message: error.response?.data?.message || 'Failed to load admin data',
          type: 'danger'
        })
      );
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      dispatch(
        showToast({
          title: 'Order updated',
          message: 'Order status changed successfully',
          type: 'success'
        })
      );
      loadAdminData();
    } catch (error) {
      dispatch(
        showToast({
          title: 'Update failed',
          message: error.response?.data?.message || 'Could not update order',
          type: 'danger'
        })
      );
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/categories', categoryForm);
      setCategoryForm({ name: '', slug: '' });
      dispatch(
        showToast({
          title: 'Category added',
          message: 'New category is now available.',
          type: 'success'
        })
      );
      loadAdminData();
    } catch (error) {
      dispatch(
        showToast({
          title: 'Creation failed',
          message: error.response?.data?.message || 'Could not create category',
          type: 'danger'
        })
      );
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        images: productForm.images.split(',').map((url) => url.trim()),
        categoryId: Number(productForm.categoryId)
      };
      await api.post('/admin/products', payload);
      setProductForm({ name: '', slug: '', description: '', price: '', stock: '', categoryId: '', images: '' });
      dispatch(
        showToast({
          title: 'Product created',
          message: 'Product successfully added to catalog.',
          type: 'success'
        })
      );
      loadAdminData();
    } catch (error) {
      dispatch(
        showToast({
          title: 'Creation failed',
          message: error.response?.data?.message || 'Could not create product',
          type: 'danger'
        })
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">{adminView ? 'Admin dashboard' : 'Your profile'}</h1>
        <p className="text-white/60">
          {adminView
            ? 'Manage products, categories, and orders with a secure admin workflow.'
            : 'Review your account details and order history.'}
        </p>
      </div>

      {!adminView && (
        <section className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm text-white/60">Signed in as {user?.email}</p>
          </div>
          <div className="glass-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order history</h2>
            </div>
            {status === 'loading' ? (
              <Loader label="Loading orders" />
            ) : orders.length ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white/60">Order #{order.id}</p>
                        <p className="text-xs text-white/40">{formatDate(order.createdAt)}</p>
                      </div>
                      <Badge variant={statusVariants[order.status] || 'default'}>{order.status}</Badge>
                      <p className="text-lg font-semibold text-neon">{formatCurrency(Number(order.total))}</p>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs text-white/60">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity} × Product #{item.productId} at {formatCurrency(Number(item.priceAtPurchase))}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/60">You have not placed any orders yet.</p>
            )}
          </div>
        </section>
      )}

      {adminView && (
        <section className="space-y-8">
          <div className="glass-panel space-y-4 p-6">
            <h2 className="text-xl font-semibold">Create product</h2>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateProduct}>
              <Input
                label="Name"
                value={productForm.name}
                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="Slug"
                value={productForm.slug}
                onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
              />
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
              />
              <Input
                label="Stock"
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
              />
              <div className="md:col-span-2">
                <Input
                  label="Description"
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Input
                label="Category ID"
                value={productForm.categoryId}
                onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              />
              <Input
                label="Image URLs (comma separated)"
                value={productForm.images}
                onChange={(e) => setProductForm((prev) => ({ ...prev, images: e.target.value }))}
              />
              <Button type="submit" className="md:col-span-2">
                Save product
              </Button>
            </form>
          </div>

          <div className="glass-panel space-y-4 p-6">
            <h2 className="text-xl font-semibold">Create category</h2>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateCategory}>
              <Input
                label="Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="Slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))}
              />
              <Button type="submit" className="md:col-span-2">
                Save category
              </Button>
            </form>
          </div>

          <div className="glass-panel space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Orders overview</h2>
              <Button variant="ghost" onClick={loadAdminData}>
                Refresh
              </Button>
            </div>
            {loadingAdmin ? (
              <Loader label="Loading admin data" />
            ) : (
              <div className="space-y-4">
                {adminData.orders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white/60">Order #{order.id}</p>
                        <p className="text-xs text-white/40">{formatDate(order.createdAt)}</p>
                        <p className="text-xs text-white/40">Customer: {order.user?.email}</p>
                      </div>
                      <Badge variant={statusVariants[order.status] || 'default'}>{order.status}</Badge>
                      <p className="text-lg font-semibold text-neon">{formatCurrency(Number(order.total))}</p>
                      <select
                        className="focus-ring rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm"
                        value={order.status}
                        onChange={(event) => handleStatusUpdate(order.id, event.target.value)}
                      >
                        {Object.keys(statusVariants).map((statusKey) => (
                          <option key={statusKey} value={statusKey}>
                            {statusKey}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel space-y-4 p-6">
            <h2 className="text-xl font-semibold">Catalog snapshot</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-white/80">Products</h3>
                <ul className="mt-2 space-y-2 text-xs text-white/60">
                  {adminData.products.slice(0, 6).map((product) => (
                    <li key={product.id} className="flex items-center justify-between">
                      <span>{product.name}</span>
                      <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                        {product.stock} in stock
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/80">Categories</h3>
                <ul className="mt-2 space-y-2 text-xs text-white/60">
                  {adminData.categories.map((category) => (
                    <li key={category.id} className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-white/40">/{category.slug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
