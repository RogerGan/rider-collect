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

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div className="mk-wrap" style={{ maxWidth: 560, margin: '0 auto' }}>
      <section className="mk-hero" style={{ padding: '24px 16px' }}>
        <div className="mk-hero-left" style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28 }}>🚴‍♂️ 骑手专属通信优惠</h1>
          <p style={{ fontSize: 14, color: '#555' }}>为外卖骑手量身定制的稳定、划算通信服务。立即登记，专享超值权益！</p>
          <a href="#form" className="mk-cta" style={{ padding: '10px 14px', fontSize: 14 }}>🎯 立即登记开卡</a>
        </div>
        <div className="mk-hero-right" style={{ display: 'none' }}>
          <img src="/assets/hero-rider.svg" alt="骑手形象" />
        </div>
      </section>

      <section className="mk-features" style={{ gridTemplateColumns: '1fr', gap: 12, padding: '0 16px 8px' }}>
        <div className="mk-feature">
          <img src="/assets/feature-signal.svg" alt="信号稳定" />
          <h3 style={{ margin: 6 }}>信号稳定</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>城市广覆盖，配送路上信号满格不掉线。</p>
        </div>
        <div className="mk-feature">
          <img src="/assets/feature-price.svg" alt="资费优惠" />
          <h3 style={{ margin: 6 }}>资费优惠</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>骑手专属套餐，省钱省心，流量充足。</p>
        </div>
        <div className="mk-feature">
          <img src="/assets/react.svg" alt="快速服务" />
          <h3 style={{ margin: 6 }}>快速服务</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>登记即办，线上提交，最快当天开通。</p>
        </div>
      </section>

      <section id="form" style={{ padding: '12px 16px 24px' }}>
        <h2 style={{ fontSize: 20, margin: '8px 0 12px' }}>外卖骑手信息登记</h2>
        {err && <div style={{ color: '#b00020', marginBottom: 8, fontSize: 14 }}>{err}</div>}
        {ok && <div style={{ color: '#0a7', marginBottom: 8, fontSize: 14 }}>{ok}</div>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14 }}>姓名</span>
            <input name="name" value={form.name} onChange={onChange} required placeholder="姓名" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14 }}>手机号</span>
            <input name="phone" value={form.phone} onChange={onChange} required placeholder="11位手机号" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14 }}>身份证号/编号</span>
            <input name="id_number" value={form.id_number} onChange={onChange} required placeholder="6-40位字母数字" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14 }}>城市</span>
              <input name="city" value={form.city} onChange={onChange} placeholder="城市" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14 }}>运营商意向</span>
              <select name="carrier_pref" value={form.carrier_pref} onChange={onChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}>
                <option value="移动">移动</option>
                <option value="联通">联通</option>
                <option value="电信">电信</option>
              </select>
            </label>
          </div>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14 }}>地址</span>
            <input name="address" value={form.address} onChange={onChange} placeholder="送货/收货地址" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14 }}>车辆类型</span>
            <select name="vehicle_type" value={form.vehicle_type} onChange={onChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}>
              <option value="电动车">电动车</option>
              <option value="摩托车">摩托车</option>
              <option value="自行车">自行车</option>
              <option value="步行">步行</option>
            </select>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14 }}>紧急联系人</span>
              <input name="emergency_name" value={form.emergency_name} onChange={onChange} placeholder="可选" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14 }}>紧急联系人电话</span>
              <input name="emergency_phone" value={form.emergency_phone} onChange={onChange} placeholder="可选" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            </label>
          </div>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14 }}>备注</span>
            <textarea name="note" value={form.note} onChange={onChange} rows={3} placeholder="可选" style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
            我已阅读并同意隐私协议
          </label>
          <button type="submit" disabled={!canSubmit} className="mk-cta" style={{ padding: '12px 16px', fontSize: 16, textAlign: 'center' }}>
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
      </section>

      
    </div>
  );
}
