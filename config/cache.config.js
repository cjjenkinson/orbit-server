module.exports = {
  cacheConfig: {
    expire: 1800,
    routes: [
      '/',
      '/categories',
      '/categories/:id',
      '/dashboard',
      '/dashboard/:id',
      '/dashboard/:id/:entryId',
      '/dashboard/:id/:entryId/:snapId'
    ]
  }
};
