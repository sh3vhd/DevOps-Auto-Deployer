function applyRequestLogging(app, morgan) {
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(format));
}

module.exports = { applyRequestLogging };
