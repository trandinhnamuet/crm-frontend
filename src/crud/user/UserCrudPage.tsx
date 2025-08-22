import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Table, Button, Modal, message, Typography, Space, Card, Row, Col } from 'antd';
import CardList from '../../common/CardList';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserForm from './UserForm';
import { getUsers, createUser, updateUser, deleteUser } from './UserApi';
import type User from './User';
const { Title } = Typography;

export default function UserCrudPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  async function fetchUsers() {
    setLoading(true);
    try {
      setUsers(await getUsers());
    } catch (e: any) {
      message.error(e.message || 'Lỗi tải danh sách user');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setModalOpen(true);
  }

  async function handleSubmit(data: Partial<User>) {
    try {
      if (editing && editing.id) {
        await updateUser(editing.id, data);
        message.success('Cập nhật user thành công');
      } else {
        await createUser(data);
        message.success('Tạo user thành công');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (e: any) {
      message.error(e.message || 'Lỗi khi lưu user');
    }
  }

  async function handleDelete(id: number) {
    Modal.confirm({
      title: 'Xác nhận xóa user?',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('Đã xóa user');
          fetchUsers();
        } catch (e: any) {
          message.error(e.message || 'Lỗi khi xóa user');
        }
      },
    });
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Password', dataIndex: 'password', key: 'password' },
    { title: 'Full name', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Image ID', dataIndex: 'image_id', key: 'image_id' },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
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
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Quản lý User</Title>
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm user</Button>
        </Col>
      </Row>
      {isMobile ? (
        <CardList
          data={users}
          fields={[
            { label: 'Username', render: (item) => item.username },
            { label: 'ID', render: (item) => item.id },
            { label: 'Full name', render: (item) => item.fullname || '' },
            { label: 'Email', render: (item) => item.email || '' },
            { label: 'Phone', render: (item) => item.phone_number || '' },
            { label: 'Date of Birth', render: (item) => item.date_of_birth || '' },
            { label: 'Created At', render: (item) => item.created_at ? new Date(item.created_at).toLocaleString() : '' },
          ]}
          actions={(item) => <>
            <Button onClick={(e) => { e.stopPropagation(); openEdit(item); }} type="link" icon={<EditOutlined />} />
            <Button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} type="link" danger icon={<DeleteOutlined />} />
          </>}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 12 }}
          scroll={{ x: 900 }}
        />
      )}
      <Modal
        open={modalOpen}
        title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật user' : 'Thêm user'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
        centered
        styles={{ body: { padding: 0, background: '#f9fafb', borderRadius: 12 } }}
      >
        <div className="p-6">
          <UserForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
        </div>
      </Modal>
    </Card>
  );
}
