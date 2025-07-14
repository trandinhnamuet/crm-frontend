import { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space, Card, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import RouteTemplateForm from './RouteTemplateForm';
import { getRouteTemplates, createRouteTemplate, updateRouteTemplate, deleteRouteTemplate } from './RouteTemplateApi';
import type { RouteTemplate } from './RouteTemplateApi';
const { Title } = Typography;

export default function RouteTemplateCrudPage() {
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedAddCustomers, setSelectedAddCustomers] = useState<number[]>([]);
  const [addCustomerLoading, setAddCustomerLoading] = useState(false);

  async function showAddCustomer(routeTemplate: RouteTemplate) {
    setSelectedRouteTemplate(routeTemplate);
    setAddCustomerModalOpen(true);
    setAddCustomerLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      // Get all customers
      const resAll = await fetch(`${API_URL}/customers`);
      let all = resAll.ok ? await resAll.json() : [];
      // Get customers already mapped
      const resMapped = await fetch(`${API_URL}/customers/by-route-template/${routeTemplate.id}`);
      let mapped = resMapped.ok ? await resMapped.json() : [];
      // Filter out mapped customers
      const mappedIds = new Set(mapped.map((c: any) => c.id));
      all = all.filter((c: any) => !mappedIds.has(c.id));
      setAllCustomers(all);
    } catch (e) {
      setAllCustomers([]);
      message.error('Lỗi khi lấy danh sách khách hàng');
    }
    setAddCustomerLoading(false);
    setSelectedAddCustomers([]);
  }

  async function handleAddCustomers() {
    if (!selectedRouteTemplate) return;
    setAddCustomerLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      for (const customer_id of selectedAddCustomers) {
        await fetch(`${API_URL}/route-template-customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_id, route_template_id: selectedRouteTemplate.id }),
        });
      }
      message.success('Đã thêm khách hàng vào lộ trình');
      setAddCustomerModalOpen(false);
      showCustomers(selectedRouteTemplate); // refresh customer list
    } catch (e) {
      message.error('Lỗi khi thêm khách hàng');
    }
    setAddCustomerLoading(false);
  }
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedRouteTemplate, setSelectedRouteTemplate] = useState<RouteTemplate | null>(null);

  async function showCustomers(routeTemplate: RouteTemplate) {
    setSelectedRouteTemplate(routeTemplate);
    setCustomerModalOpen(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/customers/by-route-template/${routeTemplate.id}`);
      if (res.ok) {
        setCustomerList(await res.json());
      } else {
        setCustomerList([]);
        message.error('Không lấy được danh sách khách hàng');
      }
    } catch (e) {
      setCustomerList([]);
      message.error('Lỗi khi lấy danh sách khách hàng');
    }
  }
  const [routeTemplates, setRouteTemplates] = useState<RouteTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RouteTemplate | null>(null);

  async function fetchRouteTemplates() {
    setLoading(true);
    try {
      setRouteTemplates(await getRouteTemplates());
    } catch (e: any) {
      message.error(e.message || 'Lỗi tải danh sách route template');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRouteTemplates();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(routeTemplate: RouteTemplate) {
    setEditing(routeTemplate);
    setModalOpen(true);
  }

  async function handleSubmit(data: Partial<RouteTemplate>) {
    try {
      if (editing && editing.id) {
        await updateRouteTemplate(editing.id, data);
        message.success('Cập nhật route template thành công');
      } else {
        await createRouteTemplate(data);
        message.success('Tạo route template thành công');
      }
      setModalOpen(false);
      fetchRouteTemplates();
    } catch (e: any) {
      message.error(e.message || 'Lỗi khi lưu route template');
    }
  }

  async function handleDelete(id: number) {
    Modal.confirm({
      title: 'Xác nhận xóa route template?',
      onOk: async () => {
        try {
          await deleteRouteTemplate(id);
          message.success('Đã xóa route template');
          fetchRouteTemplates();
        } catch (e: any) {
          message.error(e.message || 'Lỗi khi xóa route template');
        }
      },
    });
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã lộ trình', dataIndex: 'code', key: 'code' },
    { title: 'Tên lộ trình', dataIndex: 'name', key: 'name' },
    { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
    { title: 'Kiểu lặp lại', dataIndex: 'repeat_type', key: 'repeat_type' },
    { title: 'Số tuần/ngày lặp lại', dataIndex: 'repeat_on', key: 'repeat_on' },
    { title: 'Thời gian xóa', dataIndex: 'deleted_at', key: 'deleted_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    { title: 'Hoạt động', dataIndex: 'is_active', key: 'is_active', render: (v: boolean) => v ? '✔️' : '❌' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RouteTemplate) => (
        <Space>
          <Button onClick={() => openEdit(record)} type="link" icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} type="link" danger icon={<DeleteOutlined />} />
          <Button onClick={() => showCustomers(record)} type="link">Khách hàng</Button>
          <Button onClick={() => showAddCustomer(record)} type="link" style={{ color: '#52c41a' }}>Thêm khách hàng</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }} bordered={false}>
      <Row justify="center" align="middle">
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Quản lý Lộ Trình</Title>
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm route template</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={routeTemplates}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 12 }}
        scroll={{ x: 900 }}
      />
      <Modal
        open={modalOpen}
        title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật route template' : 'Thêm route template'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        styles={{ body: { padding: 0, background: '#f9fafb', borderRadius: 12 } }}
      >
        <div className="p-6">
          <RouteTemplateForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
        </div>
      </Modal>

      <Modal
        open={customerModalOpen}
        title={<span className="text-lg font-semibold text-blue-600">Danh sách khách hàng gắn với lộ trình</span>}
        onCancel={() => setCustomerModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <div style={{ padding: 16 }}>
          {customerList.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888' }}>Không có khách hàng nào</div>
          ) : (
            <Table
              dataSource={customerList}
              rowKey="id"
              columns={[
                { title: 'ID', dataIndex: 'id', key: 'id' },
                { title: 'Tên khách hàng', dataIndex: 'name', key: 'name' },
                { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                {
                  title: 'Địa chỉ',
                  dataIndex: 'address',
                  key: 'address',
                  render: (_: string, record: any) => {
                    const { latitude, longitude, address } = record;
                    if (latitude && longitude) {
                      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                      return <a href={url} target="_blank" rel="noopener noreferrer">{address}</a>;
                    }
                    return address;
                  },
                },
              ]}
              pagination={false}
              size="small"
            />
          )}
        </div>
      </Modal>

      <Modal
        open={addCustomerModalOpen}
        title={<span className="text-lg font-semibold text-green-600">Thêm khách hàng vào lộ trình</span>}
        onCancel={() => setAddCustomerModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <div style={{ padding: 16 }}>
          <Table
            dataSource={allCustomers}
            rowKey="id"
            loading={addCustomerLoading}
            columns={[
              {
                title: '',
                dataIndex: 'checked',
                key: 'checked',
                render: (_: any, record: any) => (
                  <input
                    type="checkbox"
                    checked={selectedAddCustomers.includes(record.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedAddCustomers(prev => [...prev, record.id]);
                      } else {
                        setSelectedAddCustomers(prev => prev.filter(id => id !== record.id));
                      }
                    }}
                  />
                ),
                width: 40,
              },
              { title: 'ID', dataIndex: 'id', key: 'id' },
              { title: 'Tên khách hàng', dataIndex: 'name', key: 'name' },
              { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
              { title: 'Email', dataIndex: 'email', key: 'email' },
              { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
            ]}
            pagination={false}
            size="small"
          />
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button
              type="primary"
              disabled={selectedAddCustomers.length === 0 || addCustomerLoading}
              loading={addCustomerLoading}
              onClick={handleAddCustomers}
            >Thêm</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
