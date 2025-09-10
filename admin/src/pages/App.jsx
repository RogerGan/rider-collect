import { useEffect, useState } from 'react';
import { Layout, Table, Input, Select, Space, Button, Drawer, Form, message, Tag, theme } from 'antd';

const { Header, Content } = Layout;
// 后端接口基地址（开发环境）。如需部署跨域，请在后端 CORS 放行。
const API_BASE = 'http://localhost:7001';

export default function App() {
  const [activeTab, setActiveTab] = useState('riders');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ keyword: '', city: '', status: '', shipping_status: '', logistics_status: '' });
  const [ticketFilters, setTicketFilters] = useState({ keyword: '', category: '', status: '', priority: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form] = Form.useForm();

  const statusOptions = [ { label: 'new', value: 'new' }, { label: 'review', value: 'review' }, { label: 'approved', value: 'approved' }, { label: 'rejected', value: 'rejected' } ];
  const shipOptions = [ { label: 'pending', value: 'pending' }, { label: 'packed', value: 'packed' }, { label: 'shipped', value: 'shipped' }, { label: 'delivered', value: 'delivered' } ];
  const logisticsOptions = [ { label: 'pending', value: 'pending' }, { label: 'in_transit', value: 'in_transit' }, { label: 'signed', value: 'signed' }, { label: 'exception', value: 'exception' } ];

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(p), pageSize: String(ps), ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) }).toString();
      const res = await fetch(`${API_BASE}/api/riders?${qs}`);
      const json = await res.json();
      setData(json.list || []);
      setTotal(json.total || 0);
      setPage(json.page || p);
      setPageSize(json.pageSize || ps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === 'riders') {
      load(1, pageSize); 
    } else {
      loadTickets(1, pageSize);
    }
  }, [filters, ticketFilters, activeTab]);

  const loadTickets = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(p), pageSize: String(ps), ...Object.fromEntries(Object.entries(ticketFilters).filter(([,v]) => v)) }).toString();
      const res = await fetch(`${API_BASE}/api/tickets?${qs}`);
      const json = await res.json();
      setData(json.list || []);
      setTotal(json.total || 0);
      setPage(json.page || p);
      setPageSize(json.pageSize || ps);
    } finally {
      setLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '姓名', dataIndex: 'name' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '身份证', dataIndex: 'id_number' },
    { title: '城市', dataIndex: 'city' },
    { title: '运营商', dataIndex: 'carrier_pref' },
    { title: '状态', dataIndex: 'status', render: v => <Tag color={v==='approved'?'green':v==='rejected'?'red':v==='review'?'gold':'default'}>{v || '-'}</Tag> },
    { title: '发货', dataIndex: 'shipping_status', render: v => <Tag>{v || '-'}</Tag> },
    { title: '物流', dataIndex: 'logistics_status', render: v => <Tag>{v || '-'}</Tag> },
    { title: '操作', render: (_, r) => <Button size="small" onClick={() => onEdit(r)}>编辑</Button> },
  ];

  const ticketColumns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '标题', dataIndex: 'title', width: 200 },
    { title: '联系人', dataIndex: 'contact_name' },
    { title: '联系电话', dataIndex: 'contact_phone' },
    { title: '类型', dataIndex: 'category', render: v => <Tag>{v || '-'}</Tag> },
    { title: '优先级', dataIndex: 'priority', render: v => <Tag color={v==='urgent'?'red':v==='high'?'orange':v==='low'?'blue':'default'}>{v || '-'}</Tag> },
    { title: '状态', dataIndex: 'status', render: v => <Tag color={v==='resolved'?'green':v==='in_progress'?'gold':v==='closed'?'gray':'default'}>{v || '-'}</Tag> },
    { title: '创建时间', dataIndex: 'created_at', render: v => v ? new Date(v).toLocaleString() : '-' },
    { title: '操作', render: (_, r) => <Button size="small" onClick={() => onEditTicket(r)}>处理</Button> },
  ];

  const onEdit = (record) => {
    setCurrent(record);
    setDrawerOpen(true);
    form.setFieldsValue(record);
  };

  const onEditTicket = (record) => {
    setCurrent(record);
    setDrawerOpen(true);
    form.setFieldsValue(record);
  };

  const onSave = async () => {
    const values = await form.validateFields();
    const res = await fetch(`${API_BASE}/api/riders/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (!res.ok) {
      const t = await res.text();
      return message.error(t || '保存失败');
    }
    message.success('保存成功');
    setDrawerOpen(false);
    setCurrent(null);
    load(page, pageSize);
  };

  const onSaveTicket = async () => {
    const values = await form.validateFields();
    const res = await fetch(`${API_BASE}/api/tickets/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (!res.ok) {
      const t = await res.text();
      return message.error(t || '保存失败');
    }
    message.success('保存成功');
    setDrawerOpen(false);
    setCurrent(null);
    loadTickets(page, pageSize);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 20 }}>
        🏢 骑手信息管理后台
        <div style={{ marginLeft: 'auto' }}>
          <Button type={activeTab === 'riders' ? 'primary' : 'default'} onClick={() => setActiveTab('riders')} style={{ marginRight: 8 }}>
            骑手管理
          </Button>
          <Button type={activeTab === 'tickets' ? 'primary' : 'default'} onClick={() => setActiveTab('tickets')}>
            客服工单
          </Button>
        </div>
      </Header>
      <Content style={{ padding: 16 }}>
        {activeTab === 'riders' ? (
          <>
            <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
              <Input allowClear placeholder="搜索姓名/手机号/证件" style={{ width: 240 }} value={filters.keyword} onChange={e => setFilters(s => ({ ...s, keyword: e.target.value }))} />
              <Input allowClear placeholder="城市" style={{ width: 160 }} value={filters.city} onChange={e => setFilters(s => ({ ...s, city: e.target.value }))} />
              <Select allowClear placeholder="状态" style={{ width: 160 }} options={statusOptions} value={filters.status || undefined} onChange={v => setFilters(s => ({ ...s, status: v || '' }))} />
              <Select allowClear placeholder="发货状态" style={{ width: 180 }} options={shipOptions} value={filters.shipping_status || undefined} onChange={v => setFilters(s => ({ ...s, shipping_status: v || '' }))} />
              <Select allowClear placeholder="物流状态" style={{ width: 180 }} options={logisticsOptions} value={filters.logistics_status || undefined} onChange={v => setFilters(s => ({ ...s, logistics_status: v || '' }))} />
              <Button type="primary" onClick={() => load(1, pageSize)}>查询</Button>
            </Space>
            <Table rowKey="id" size="middle" loading={loading} columns={columns} dataSource={data}
              pagination={{ current: page, pageSize, total, onChange: (cp, cps) => load(cp, cps) }} />
          </>
        ) : (
          <>
            <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
              <Input allowClear placeholder="搜索标题/联系人/电话" style={{ width: 240 }} value={ticketFilters.keyword} onChange={e => setTicketFilters(s => ({ ...s, keyword: e.target.value }))} />
              <Select allowClear placeholder="类型" style={{ width: 160 }} options={[{label:'一般咨询',value:'general'},{label:'技术问题',value:'technical'},{label:'费用问题',value:'billing'},{label:'投诉建议',value:'complaint'}]} value={ticketFilters.category || undefined} onChange={v => setTicketFilters(s => ({ ...s, category: v || '' }))} />
              <Select allowClear placeholder="状态" style={{ width: 160 }} options={[{label:'新建',value:'new'},{label:'处理中',value:'in_progress'},{label:'已解决',value:'resolved'},{label:'已关闭',value:'closed'}]} value={ticketFilters.status || undefined} onChange={v => setTicketFilters(s => ({ ...s, status: v || '' }))} />
              <Select allowClear placeholder="优先级" style={{ width: 160 }} options={[{label:'低',value:'low'},{label:'普通',value:'normal'},{label:'高',value:'high'},{label:'紧急',value:'urgent'}]} value={ticketFilters.priority || undefined} onChange={v => setTicketFilters(s => ({ ...s, priority: v || '' }))} />
              <Button type="primary" onClick={() => loadTickets(1, pageSize)}>查询</Button>
            </Space>
            <Table rowKey="id" size="middle" loading={loading} columns={ticketColumns} dataSource={data}
              pagination={{ current: page, pageSize, total, onChange: (cp, cps) => loadTickets(cp, cps) }} />
          </>
        )}

        <Drawer title={activeTab === 'riders' ? `编辑骑手 #${current?.id || ''}` : `处理工单 #${current?.id || ''}`} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={520}
          extra={<Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={activeTab === 'riders' ? onSave : onSaveTicket}>保存</Button></Space>}>
          <Form form={form} layout="vertical">
            {activeTab === 'riders' ? (
              <>
                <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="phone" label="手机号" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="id_number" label="身份证" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="city" label="城市"><Input /></Form.Item>
                <Form.Item name="carrier_pref" label="运营商"><Input /></Form.Item>
                <Form.Item name="status" label="状态"><Select options={statusOptions} /></Form.Item>
                <Form.Item name="shipping_status" label="发货状态"><Select options={shipOptions} /></Form.Item>
                <Form.Item name="logistics_status" label="物流状态"><Select options={logisticsOptions} /></Form.Item>
                <Form.Item name="address" label="地址"><Input /></Form.Item>
                <Form.Item name="note" label="备注"><Input.TextArea rows={3} /></Form.Item>
              </>
            ) : (
              <>
                <Form.Item name="title" label="标题"><Input disabled /></Form.Item>
                <Form.Item name="description" label="问题描述"><Input.TextArea rows={4} disabled /></Form.Item>
                <Form.Item name="contact_name" label="联系人"><Input disabled /></Form.Item>
                <Form.Item name="contact_phone" label="联系电话"><Input disabled /></Form.Item>
                <Form.Item name="contact_email" label="邮箱"><Input disabled /></Form.Item>
                <Form.Item name="category" label="类型"><Input disabled /></Form.Item>
                <Form.Item name="priority" label="优先级"><Select options={[{label:'低',value:'low'},{label:'普通',value:'normal'},{label:'高',value:'high'},{label:'紧急',value:'urgent'}]} /></Form.Item>
                <Form.Item name="status" label="状态"><Select options={[{label:'新建',value:'new'},{label:'处理中',value:'in_progress'},{label:'已解决',value:'resolved'},{label:'已关闭',value:'closed'}]} /></Form.Item>
                <Form.Item name="admin_reply" label="客服回复"><Input.TextArea rows={4} placeholder="请输入回复内容" /></Form.Item>
              </>
            )}
          </Form>
        </Drawer>
      </Content>
    </Layout>
  );
}
