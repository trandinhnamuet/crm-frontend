import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import RouteTemplateForm from './RouteTemplateForm';
import { getRouteTemplates, createRouteTemplate, updateRouteTemplate, deleteRouteTemplate } from './RouteTemplateApi';
import type { RouteTemplate } from './RouteTemplateApi';

export default function RouteTemplateCrudPage() {
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
    console.log('openEdit', routeTemplate);
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
    // Đảm bảo log luôn xuất hiện
    console.log('handleDelete', id);
    Modal.confirm({
      title: 'Xác nhận xóa route template?',
      onOk: async () => {
        try {
          console.log('onOk delete', id);
          await deleteRouteTemplate(id);
          message.success('Đã xóa route template');
          fetchRouteTemplates();
        } catch (e: any) {
          console.error('Delete error', e);
          message.error(e.message || 'Lỗi khi xóa route template');
        }
      },
      onCancel: () => {
        console.log('Delete cancelled');
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
    { title: 'ID người tạo', dataIndex: 'created_by', key: 'created_by' },
    { title: 'Thời gian tạo', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    { title: 'ID người cập nhật', dataIndex: 'updated_by', key: 'updated_by' },
    { title: 'Thời gian cập nhật', dataIndex: 'updated_at', key: 'updated_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    { title: 'ID người xóa', dataIndex: 'deleted_by', key: 'deleted_by' },
    { title: 'Thời gian xóa', dataIndex: 'deleted_at', key: 'deleted_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    { title: 'Hoạt động', dataIndex: 'is_active', key: 'is_active', render: (v: boolean) => v ? '✔️' : '❌' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RouteTemplate) => (
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
        <h2 className="text-3xl font-bold text-center mb-8">Quản lý Route Template</h2>
        <div className="flex justify-end mb-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm route template</Button>
        </div>
        <div className="bg-white rounded shadow p-2 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={routeTemplates}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 12 }}
            scroll={{ x: 900 }}
          />
        </div>
        <Modal
          open={modalOpen}
          title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật route template' : 'Thêm route template'}</span>}
          onCancel={() => setModalOpen(false)}
          footer={null}
          destroyOnHidden
          centered
          styles={{ body: { padding: 0, background: '#f9fafb', borderRadius: 12 } }}
        >
          <div className="p-6">
            <RouteTemplateForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
