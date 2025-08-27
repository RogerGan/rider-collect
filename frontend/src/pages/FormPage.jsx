import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:7001';

export default function FormPage() {
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

  const canSubmit = useMemo(() => {
    return form.name && /^1\d{10}$/.test(form.phone) && /^[0-9A-Za-z]{6,40}$/.test(form.id_number) && form.agree && !loading;
  }, [form, loading]);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

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

  const loadList = async () => {
    const res = await fetch(`${API_BASE}/api/riders?page=1&pageSize=10`);
    const data = await res.json();
    setList(data.list || []);
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <h2>外卖骑手信息收集</h2>
      <p>信息仅用于开通电话卡和运营商办理，严格内用。</p>
      {err && <div style={{ color: '#b00020', marginBottom: 8 }}>{err}</div>}
      {ok && <div style={{ color: '#0a7', marginBottom: 8 }}>{ok}</div>}

      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label>姓名</label>
          <input name="name" value={form.name} onChange={onChange} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>手机号</label>
          <input name="phone" value={form.phone} onChange={onChange} required placeholder="11位手机号" style={{ width: '100%' }} />
        </div>
        <div>
          <label>身份证号/编号</label>
          <input name="id_number" value={form.id_number} onChange={onChange} required placeholder="6-40位字母数字" style={{ width: '100%' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>城市</label>
            <input name="city" value={form.city} onChange={onChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>运营商意向</label>
            <select name="carrier_pref" value={form.carrier_pref} onChange={onChange} style={{ width: '100%' }}>
              <option value="移动">移动</option>
              <option value="联通">联通</option>
              <option value="电信">电信</option>
            </select>
          </div>
        </div>
        <div>
          <label>地址</label>
          <input name="address" value={form.address} onChange={onChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label>车辆类型</label>
          <select name="vehicle_type" value={form.vehicle_type} onChange={onChange} style={{ width: '100%' }}>
            <option value="电动车">电动车</option>
            <option value="摩托车">摩托车</option>
            <option value="自行车">自行车</option>
            <option value="步行">步行</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>紧急联系人</label>
            <input name="emergency_name" value={form.emergency_name} onChange={onChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>紧急联系人电话</label>
            <input name="emergency_phone" value={form.emergency_phone} onChange={onChange} placeholder="可选" style={{ width: '100%' }} />
          </div>
        </div>
        <div>
          <label>备注</label>
          <textarea name="note" value={form.note} onChange={onChange} rows={3} style={{ width: '100%' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
          我已阅读并同意隐私协议
        </label>
        <button type="submit" disabled={!canSubmit} style={{ padding: '8px 16px' }}>
          {loading ? '提交中...' : '提交'}
        </button>
      </form>

      <h3 style={{ marginTop: 32 }}>最近提交</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>姓名</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>手机号</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>身份证</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>运营商</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>城市</th>
          </tr>
        </thead>
        <tbody>
          {list.map(r => (
            <tr key={r.id}>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 6 }}>{r.name}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 6 }}>{r.phone}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 6 }}>{r.id_number}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 6 }}>{r.carrier_pref}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 6 }}>{r.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
