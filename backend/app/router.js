module.exports = app => {
  const { router, controller } = app;
  router.get('/api/riders', controller.rider.index);
  router.get('/api/riders/:id', controller.rider.show);
  router.post('/api/riders', controller.rider.create);
  router.put('/api/riders/:id', controller.rider.update);
};
