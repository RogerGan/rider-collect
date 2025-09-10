const Controller = require('egg').Controller;

class TicketController extends Controller {
  async index() {
    const { ctx, app } = this;
    const page = Math.max(1, parseInt(ctx.query.page || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(ctx.query.pageSize || '20', 10)));
    const offset = (page - 1) * pageSize;

    const Ticket = app.model.Ticket;
    const { Op } = app.Sequelize;
    const where = { is_deleted: 0 };
    if (ctx.query.keyword) {
      const kw = `%${ctx.query.keyword.trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: kw } },
        { contact_name: { [Op.like]: kw } },
        { contact_phone: { [Op.like]: kw } },
      ];
    }
    if (ctx.query.category) where.category = ctx.query.category;
    if (ctx.query.status) where.status = ctx.query.status;
    if (ctx.query.priority) where.priority = ctx.query.priority;

    const { rows, count } = await Ticket.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [[ 'id', 'DESC' ]],
    });
    ctx.body = { list: rows, page, pageSize, total: count };
  }

  async show() {
    const { ctx, app } = this;
    const id = parseInt(ctx.params.id, 10);
    if (!id) return ctx.throw(400, 'invalid id');

    const Ticket = app.model.Ticket;
    const ticket = await Ticket.findOne({ where: { id, is_deleted: 0 } });
    if (!ticket) return ctx.throw(404, 'not found');
    ctx.body = ticket;
  }

  async create() {
    const { ctx, app } = this;
    const body = ctx.request.body || {};

    const validate = () => {
      const required = [ 'title', 'description', 'contact_name', 'contact_phone' ];
      for (const k of required) if (!body[k]) return `${k} is required`;
      if (!/^1\d{10}$/.test(body.contact_phone || '')) return 'invalid contact_phone';
      if (body.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contact_email)) return 'invalid contact_email';
      return null;
    };
    const err = validate();
    if (err) return ctx.throw(400, err);

    const now = new Date();
    const data = {
      title: body.title.trim(),
      description: body.description.trim(),
      contact_name: body.contact_name.trim(),
      contact_phone: body.contact_phone.trim(),
      contact_email: (body.contact_email || '').trim(),
      category: (body.category || 'general').trim(),
      priority: (body.priority || 'normal').trim(),
      status: 'new',
      admin_reply: '',
      created_at: now,
      updated_at: now,
      is_deleted: 0,
    };

    const Ticket = app.model.Ticket;
    const res = await Ticket.create(data);
    ctx.body = { id: res.id };
  }

  async update() {
    const { ctx, app } = this;
    const id = parseInt(ctx.params.id, 10);
    if (!id) return ctx.throw(400, 'invalid id');
    const body = ctx.request.body || {};
    const Ticket = app.model.Ticket;
    const ticket = await Ticket.findByPk(id);
    if (!ticket || ticket.is_deleted) return ctx.throw(404, 'not found');

    const updatable = [ 'status', 'priority', 'admin_reply' ];
    const data = {};
    for (const k of updatable) if (k in body) data[k] = body[k];
    data.updated_at = new Date();
    await Ticket.update(data, { where: { id } });
    const latest = await Ticket.findByPk(id);
    ctx.body = latest;
  }
}

module.exports = TicketController;
