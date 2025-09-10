module.exports = app => {
  const { router, controller } = app;
  router.get('/api/riders', controller.rider.index);
  router.get('/api/riders/:id', controller.rider.show);
  router.post('/api/riders', controller.rider.create);
  router.put('/api/riders/:id', controller.rider.update);
  router.get('/api/tickets', controller.ticket.index);
  router.get('/api/tickets/:id', controller.ticket.show);
  router.post('/api/tickets', controller.ticket.create);
  router.put('/api/tickets/:id', controller.ticket.update);
};
