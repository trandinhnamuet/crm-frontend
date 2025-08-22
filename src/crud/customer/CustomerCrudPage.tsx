import type { Customer } from './CustomerApi';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Table, Button, Modal, message, Space, Card, Row, Col, Typography } from 'antd';
import CardList from '../../common/CardList';
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from './CustomerApi';
const { Title } = Typography;

export default function CustomerCrudPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
          <Button onClick={(e) => { e.stopPropagation(); navigate(`/customer/${record.id}/history`); }} type="link" icon={<HistoryOutlined />} />
          <Button onClick={(e) => { e.stopPropagation(); openEdit(record); }} type="link" icon={<EditOutlined />} />
          <Button onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }} type="link" danger icon={<DeleteOutlined />} />
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
      {isMobile ? (
        <CardList
          data={customers}
          fields={[
            { label: 'Tên khách hàng', render: (item) => item.name },
            { label: 'ID', render: (item) => item.id },
            { label: 'Mã khách hàng', render: (item) => item.code || '' },
            { label: 'SĐT', render: (item) => item.phone_number || '' },
            { label: 'Email', render: (item) => item.email || '' },
            { label: 'Địa chỉ', render: (item) => {
              const { latitude, longitude, address } = item;
              if (latitude && longitude) {
                const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                return <a href={url} target="_blank" rel="noopener noreferrer">{address}</a>;
              }
              return address || '';
            }},
            { label: 'Ghi chú', render: (item) => item.note || '' },
            { label: 'Hoạt động', render: (item) => item.is_active ? '✔️' : '❌' },
          ]}
          actions={(item) => <>
            <Button onClick={(e) => { e.stopPropagation(); navigate(`/customer/${item.id}/history`); }} type="link" icon={<HistoryOutlined />} />
            <Button onClick={(e) => { e.stopPropagation(); openEdit(item); }} type="link" icon={<EditOutlined />} />
            <Button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} type="link" danger icon={<DeleteOutlined />} />
          </>}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 12 }}
          scroll={{ x: 1200 }}
        />
      )}
      <Modal
        open={modalOpen}
        title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
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
