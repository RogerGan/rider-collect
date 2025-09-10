import { useEffect, useMemo, useState } from 'react';
// 营销区块与按钮样式（移动端友好）
import './pages/marketing.css';

// 后端接口基地址（开发环境）
const API_BASE = 'http://localhost:7001';

export default function App() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    id_number: '',
    city: '',
    address: '',
    carrier_pref: '移动',
    vehicle_type: '电动车',
    emergency_name: '',
    emergency_phone: '',
    note: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    category: 'general',
    priority: 'normal'
  });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // 提交条件：基础校验 + 已勾选协议 + 非加载状态
  const canSubmit = useMemo(() => {
    return form.name && /^1\d{10}$/.test(form.phone) && /^[0-9A-Za-z]{6,40}$/.test(form.id_number) && form.agree && !loading;
  }, [form, loading]);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  // 提交表单：成功后刷新列表并重置表单
  const submit = async e => {
    e.preventDefault();
    setErr('');
    setOk('');
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/riders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || '提交失败');
      }
      await res.json();
      setOk('提交成功');
      await loadList();
      setForm({
        name: '',
        phone: '',
        id_number: '',
        city: '',
        address: '',
        carrier_pref: '移动',
        vehicle_type: '电动车',
        emergency_name: '',
        emergency_phone: '',
        note: '',
        agree: false,
      });
    } catch (e2) {
      setErr(e2.message || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载最近提交：仅取前 10 条，便于演示
  const loadList = async () => {
    const res = await fetch(`${API_BASE}/api/riders?page=1&pageSize=10`);
    const data = await res.json();
    setList(data.list || []);
  };

  const onTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description || !ticketForm.contact_name || !ticketForm.contact_phone) return;
    setTicketLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm),
      });
      if (res.ok) {
        alert('工单提交成功！我们会尽快联系您。');
        setTicketForm({
          title: '',
          description: '',
          contact_name: '',
          contact_phone: '',
          contact_email: '',
          category: 'general',
          priority: 'normal'
        });
        setShowCustomerService(false);
      } else {
        const text = await res.text();
        alert(text || '提交失败，请稍后重试');
      }
    } catch {
      alert('网络错误，请稍后重试');
    } finally {
      setTicketLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div className="mk-wrap">
      <section className="mk-hero">
        <div className="mk-hero-left">
          <h1>🚴‍♂️ 骑手专属通信优惠</h1>
          <p>为外卖骑手量身定制的稳定、划算通信服务。立即登记，专享超值权益！</p>
          <a href="#form" className="mk-cta">🎯 立即登记开卡</a>
        </div>
        <div className="mk-hero-right">
          <img src="/assets/hero-rider.svg" alt="骑手形象" />
        </div>
      </section>

      <section className="mk-features">
        <div className="mk-feature">
          <img src="/assets/feature-signal.svg" alt="信号稳定" />
          <h3>信号稳定</h3>
          <p>城市广覆盖，配送路上信号满格不掉线。</p>
        </div>
        <div className="mk-feature">
          <img src="/assets/feature-price.svg" alt="资费优惠" />
          <h3>资费优惠</h3>
          <p>骑手专属套餐，省钱省心，流量充足。</p>
        </div>
        <div className="mk-feature">
          <img src="/assets/react.svg" alt="快速服务" />
          <h3>快速服务</h3>
          <p>登记即办，线上提交，最快当天开通。</p>
        </div>
      </section>

      <section className="mk-steps">
        <h2>开卡流程</h2>
        <ol>
          <li>在线提交信息</li>
          <li>客服确认与审核</li>
          <li>线下或邮寄开卡</li>
        </ol>
      </section>

      <section id="form" className="mk-form-section">
        <div className="mk-form-container">
          <h2>外卖骑手信息登记</h2>
          {err && <div className="mk-error">{err}</div>}
          {ok && <div className="mk-success">{ok}</div>}
          <form onSubmit={submit}>
            <label>
              <span>姓名</span>
              <input name="name" value={form.name} onChange={onChange} required placeholder="姓名" />
            </label>
            <label>
              <span>手机号</span>
              <input name="phone" value={form.phone} onChange={onChange} required placeholder="11位手机号" />
            </label>
            <label>
              <span>身份证号/编号</span>
              <input name="id_number" value={form.id_number} onChange={onChange} required placeholder="6-40位字母数字" />
            </label>
            <div className="mk-form-row">
              <label>
                <span>城市</span>
                <input name="city" value={form.city} onChange={onChange} placeholder="城市" />
              </label>
              <label>
                <span>运营商意向</span>
                <select name="carrier_pref" value={form.carrier_pref} onChange={onChange}>
                  <option value="移动">移动</option>
                  <option value="联通">联通</option>
                  <option value="电信">电信</option>
                </select>
              </label>
            </div>
            <label>
              <span>地址</span>
              <input name="address" value={form.address} onChange={onChange} placeholder="送货/收货地址" />
            </label>
            <label>
              <span>车辆类型</span>
              <select name="vehicle_type" value={form.vehicle_type} onChange={onChange}>
                <option value="电动车">电动车</option>
                <option value="摩托车">摩托车</option>
                <option value="自行车">自行车</option>
                <option value="步行">步行</option>
              </select>
            </label>
            <div className="mk-form-row">
              <label>
                <span>紧急联系人</span>
                <input name="emergency_name" value={form.emergency_name} onChange={onChange} placeholder="可选" />
              </label>
              <label>
                <span>紧急联系人电话</span>
                <input name="emergency_phone" value={form.emergency_phone} onChange={onChange} placeholder="可选" />
              </label>
            </div>
            <label>
              <span>备注</span>
              <textarea name="note" value={form.note} onChange={onChange} rows={3} placeholder="可选" />
            </label>
            <label className="mk-checkbox-label">
              <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
              我已阅读并同意隐私协议
            </label>
            <button type="submit" disabled={!canSubmit}>
              {loading ? '提交中...' : '提交'}
            </button>
          </form>

          <h3 style={{ marginTop: 20, fontSize: 16 }}>最近提交</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>姓名</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>手机号</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>身份证</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>运营商</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>城市</th>
                </tr>
              </thead>
              <tbody>
                {list.map(r => (
                  <tr key={r.id}>
                    <td style={{ borderBottom: '1px solid #f6f6f6', padding: 6 }}>{r.name}</td>
                    <td style={{ borderBottom: '1px solid #f6f6f6', padding: 6 }}>{r.phone}</td>
                    <td style={{ borderBottom: '1px solid #f6f6f6', padding: 6 }}>{r.id_number}</td>
                    <td style={{ borderBottom: '1px solid #f6f6f6', padding: 6 }}>{r.carrier_pref}</td>
                    <td style={{ borderBottom: '1px solid #f6f6f6', padding: 6 }}>{r.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showCustomerService && (
        <div className="mk-customer-service-modal">
          <div className="mk-customer-service-content">
            <div className="mk-customer-service-header">
              <h3>💬 联系客服</h3>
              <button className="mk-close-btn" onClick={() => setShowCustomerService(false)}>×</button>
            </div>
            <form onSubmit={onSubmitTicket}>
              <div className="mk-form-row">
                <label>
                  <span>问题标题 *</span>
                  <input name="title" value={ticketForm.title} onChange={onTicketChange} placeholder="请简要描述您的问题" required />
                </label>
              </div>
              <label>
                <span>问题描述 *</span>
                <textarea name="description" value={ticketForm.description} onChange={onTicketChange} placeholder="请详细描述您遇到的问题" rows="4" required></textarea>
              </label>
              <div className="mk-form-row">
                <label>
                  <span>联系人 *</span>
                  <input name="contact_name" value={ticketForm.contact_name} onChange={onTicketChange} placeholder="您的姓名" required />
                </label>
                <label>
                  <span>联系电话 *</span>
                  <input name="contact_phone" value={ticketForm.contact_phone} onChange={onTicketChange} placeholder="手机号码" required />
                </label>
              </div>
              <label>
                <span>邮箱（可选）</span>
                <input name="contact_email" value={ticketForm.contact_email} onChange={onTicketChange} placeholder="邮箱地址" />
              </label>
              <div className="mk-form-row">
                <label>
                  <span>问题类型</span>
                  <select name="category" value={ticketForm.category} onChange={onTicketChange}>
                    <option value="general">一般咨询</option>
                    <option value="technical">技术问题</option>
                    <option value="billing">费用问题</option>
                    <option value="complaint">投诉建议</option>
                  </select>
                </label>
                <label>
                  <span>紧急程度</span>
                  <select name="priority" value={ticketForm.priority} onChange={onTicketChange}>
                    <option value="low">低</option>
                    <option value="normal">普通</option>
                    <option value="high">高</option>
                    <option value="urgent">紧急</option>
                  </select>
                </label>
              </div>
              <button type="submit" disabled={ticketLoading}>
                {ticketLoading ? '提交中...' : '提交工单'}
              </button>
            </form>
          </div>
        </div>
      )}

      <button className="mk-customer-service-btn" onClick={() => setShowCustomerService(true)}>
        💬 客服
      </button>
    </div>
  );
}
