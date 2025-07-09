
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Typography, Space } from 'antd';
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
          <Button onClick={() => openEdit(record)} type="link" icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} type="link" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-white overflow-auto">
      <div className="mx-auto min-h-screen py-8 px-2">
        <h2 className="text-3xl font-bold text-center mb-8">Quản lý User</h2>
        <div className="flex justify-end mb-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm user</Button>
        </div>
        <div className="bg-white rounded shadow p-2 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 12 }}
            scroll={{ x: 900 }}
          />
        </div>
        <Modal
          open={modalOpen}
          title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật user' : 'Thêm user'}</span>}
          onCancel={() => setModalOpen(false)}
          footer={null}
          destroyOnClose
          centered
          styles={{ body: { padding: 0, background: '#f9fafb', borderRadius: 12 } }}
        >
          <div className="p-6">
            <UserForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
