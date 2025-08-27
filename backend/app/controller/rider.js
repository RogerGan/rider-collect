// Rider 数据控制器：提供列表查询、详情、创建与更新能力
const Controller = require('egg').Controller;

class RiderController extends Controller {
  // 列表查询：支持分页与多条件筛选（keyword/city/status/shipping_status/logistics_status）
  async index() {
    const { ctx, app } = this;
    const page = Math.max(1, parseInt(ctx.query.page || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(ctx.query.pageSize || '20', 10)));
    const offset = (page - 1) * pageSize;

    const Rider = app.model.Rider;
    const { Op } = app.Sequelize;
    const where = { is_deleted: 0 };
    if (ctx.query.keyword) {
      const kw = `%${ctx.query.keyword.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: kw } },
        { phone: { [Op.like]: kw } },
        { id_number: { [Op.like]: kw } },
      ];
    }
    if (ctx.query.city) where.city = ctx.query.city;
    if (ctx.query.status) where.status = ctx.query.status;
    if (ctx.query.shipping_status) where.shipping_status = ctx.query.shipping_status;
    if (ctx.query.logistics_status) where.logistics_status = ctx.query.logistics_status;

    const { rows, count } = await Rider.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [[ 'id', 'DESC' ]],
    });
    ctx.body = { list: rows, page, pageSize, total: count };
  }

  // 详情：按 ID 查询未删除数据
  async show() {
    const { ctx, app } = this;
    const id = parseInt(ctx.params.id, 10);
    if (!id) return ctx.throw(400, 'invalid id');

    const Rider = app.model.Rider;
    const rider = await Rider.findOne({ where: { id, is_deleted: 0 } });
    if (!rider) return ctx.throw(404, 'not found');
    ctx.body = rider;
  }

  // 新增：基础字段校验 + 去重（phone + id_number）
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
      status: (body.status || 'new').trim(),
      shipping_status: (body.shipping_status || 'pending').trim(),
      logistics_status: (body.logistics_status || 'pending').trim(),
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

  // 更新：允许后台修改基础信息与状态字段
  async update() {
    const { ctx, app } = this;
    const id = parseInt(ctx.params.id, 10);
    if (!id) return ctx.throw(400, 'invalid id');
    const body = ctx.request.body || {};
    const Rider = app.model.Rider;
    const rider = await Rider.findByPk(id);
    if (!rider || rider.is_deleted) return ctx.throw(404, 'not found');

    const updatable = [ 'name','phone','id_number','city','address','carrier_pref','vehicle_type','emergency_name','emergency_phone','note','agree','status','shipping_status','logistics_status' ];
    const data = {};
    for (const k of updatable) if (k in body) data[k] = body[k];
    data.updated_at = new Date();
    await Rider.update(data, { where: { id } });
    const latest = await Rider.findByPk(id);
    ctx.body = latest;
  }
}

module.exports = RiderController;
