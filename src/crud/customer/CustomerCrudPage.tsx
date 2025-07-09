import type { Customer } from './CustomerApi';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomerForm from './CustomerForm';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from './CustomerApi';

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
    { title: 'Mã KH', dataIndex: 'code', key: 'code' },
    { title: 'Tên KH', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    { title: 'ID Ảnh', dataIndex: 'image_id', key: 'image_id' },
    { title: 'Lat', dataIndex: 'latitude', key: 'latitude' },
    { title: 'Lng', dataIndex: 'longitude', key: 'longitude' },
    { title: 'Người tạo', dataIndex: 'created_by', key: 'created_by' },
    { title: 'Tạo lúc', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    { title: 'Người cập nhật', dataIndex: 'updated_by', key: 'updated_by' },
    { title: 'Cập nhật lúc', dataIndex: 'updated_at', key: 'updated_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    { title: 'Người xóa', dataIndex: 'deleted_by', key: 'deleted_by' },
    { title: 'Xóa lúc', dataIndex: 'deleted_at', key: 'deleted_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
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
    <div className="fixed inset-0 bg-white overflow-auto">
      <div className="mx-auto min-h-screen py-8 px-2">
        <h2 className="text-3xl font-bold text-center mb-8">Quản lý Khách hàng</h2>
        <div className="flex justify-end mb-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm khách hàng</Button>
        </div>
        <div className="bg-white rounded shadow p-2 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 12 }}
            scroll={{ x: 1200 }}
          />
        </div>
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
      </div>
    </div>
  );
}
