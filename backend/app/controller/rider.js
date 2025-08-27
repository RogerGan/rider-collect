const Controller = require('egg').Controller;

class RiderController extends Controller {
  async index() {
    const { ctx, app } = this;
    const page = Math.max(1, parseInt(ctx.query.page || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(ctx.query.pageSize || '20', 10)));
    const offset = (page - 1) * pageSize;

    const Rider = app.model.Rider;
    const { rows, count } = await Rider.findAndCountAll({
      where: { is_deleted: 0 },
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

    const Rider = app.model.Rider;
    const rider = await Rider.findOne({ where: { id, is_deleted: 0 } });
    if (!rider) return ctx.throw(404, 'not found');
    ctx.body = rider;
  }

  async create() {
    const { ctx, app } = this;
    const body = ctx.request.body || {};

    const validate = () => {
      const required = [ 'name', 'phone', 'id_number' ];
      for (const k of required) if (!body[k]) return `${k} is required`;
      if (!/^1\d{10}$/.test(body.phone || '')) return 'invalid phone';
      if (!/^[0-9A-Za-z]{6,40}$/.test(body.id_number || '')) return 'invalid id_number';
      if (body.emergency_phone && !/^1\d{10}$/.test(body.emergency_phone)) return 'invalid emergency_phone';
      return null;
    };
    const err = validate();
    if (err) return ctx.throw(400, err);

    const now = new Date();
    const data = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      id_number: body.id_number.trim(),
      city: (body.city || '').trim(),
      address: (body.address || '').trim(),
      carrier_pref: (body.carrier_pref || '').trim(),
      vehicle_type: (body.vehicle_type || '').trim(),
      emergency_name: (body.emergency_name || '').trim(),
      emergency_phone: (body.emergency_phone || '').trim(),
      note: (body.note || '').trim(),
      agree: body.agree ? 1 : 0,
      created_at: now,
      updated_at: now,
      is_deleted: 0,
    };

    const Rider = app.model.Rider;
    const exist = await Rider.findOne({ where: { phone: data.phone, id_number: data.id_number, is_deleted: 0 } });
    if (exist) return ctx.throw(409, 'duplicated rider');

    const res = await Rider.create(data);
    ctx.body = { id: res.id };
  }
}

module.exports = RiderController;
