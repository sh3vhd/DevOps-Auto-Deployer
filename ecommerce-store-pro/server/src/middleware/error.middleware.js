function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const payload = {
    success: false,
    message: err.message || 'Something went wrong'
  };

  if (err.errors) {
    payload.errors = err.errors;
  }

  // eslint-disable-next-line no-console
  console.error('API Error:', err);

  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
