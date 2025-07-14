import type { Customer } from './CustomerApi';
import { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space, Card, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomerForm from './CustomerForm';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from './CustomerApi';
const { Title } = Typography;

export default function CustomerCrudPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  async function fetchCustomers() {
    setLoading(true);
    try {
      setCustomers(await getCustomers());
    } catch (e: any) {
      message.error(e.message || 'Lỗi tải danh sách khách hàng');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(customer: Customer) {
    setEditing(customer);
    setModalOpen(true);
  }

  async function handleSubmit(data: Partial<Customer>) {
    try {
      if (editing && editing.id) {
        await updateCustomer(editing.id, data);
        message.success('Cập nhật khách hàng thành công');
      } else {
        await createCustomer(data);
        message.success('Tạo khách hàng thành công');
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (e: any) {
      message.error(e.message || 'Lỗi khi lưu khách hàng');
    }
  }

  async function handleDelete(id: number) {
    Modal.confirm({
      title: 'Xác nhận xóa khách hàng?',
      onOk: async () => {
        try {
          await deleteCustomer(id);
          message.success('Đã xóa khách hàng');
          fetchCustomers();
        } catch (e: any) {
          message.error(e.message || 'Lỗi khi xóa khách hàng');
        }
      },
    });
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã khách hàng', dataIndex: 'code', key: 'code' },
    { title: 'Tên khách hàng', dataIndex: 'name', key: 'name' },
    { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (_: string, record: Customer) => {
        const { latitude, longitude, address } = record;
        if (latitude && longitude) {
          const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
          return <a href={url} target="_blank" rel="noopener noreferrer">{address}</a>;
        }
        return address;
      },
    },
    { title: 'Vĩ độ', dataIndex: 'latitude', key: 'latitude' },
    { title: 'Kinh độ', dataIndex: 'longitude', key: 'longitude' },
    { title: 'Người tạo', dataIndex: 'created_by', key: 'created_by' },
    { title: 'Hoạt động', dataIndex: 'is_active', key: 'is_active', render: (v: boolean) => v ? '✔️' : '❌' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Customer) => (
        <Space>
          <Button onClick={() => openEdit(record)} type="link" icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} type="link" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }} bordered={false}>
      <Row justify="center" align="middle">
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Quản lý Khách hàng</Title>
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm khách hàng</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 12 }}
        scroll={{ x: 1200 }}
      />
      <Modal
        open={modalOpen}
        title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        styles={{ body: { padding: 0, background: '#f9fafb', borderRadius: 12 } }}
      >
        <div className="p-6">
          <CustomerForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
        </div>
      </Modal>
    </Card>
  );
}
