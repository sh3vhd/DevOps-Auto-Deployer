const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const { applyRequestLogging } = require('./middleware/logging.middleware');

const app = express();

// Allow local Vite dev server (and optional custom origin) to call the API with credentials.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: [CLIENT_ORIGIN],
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
applyRequestLogging(app, morgan);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'E-Commerce Store Pro API is healthy' });
});

// Versioned REST routes keep backward compatibility for future iterations.
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});
