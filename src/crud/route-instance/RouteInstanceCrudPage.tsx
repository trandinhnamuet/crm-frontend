import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space, Card, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import RouteInstanceForm from './RouteInstanceForm';
import { getRouteInstances, createRouteInstance, updateRouteInstance, deleteRouteInstance } from './RouteInstanceApi';
import type { RouteInstance } from './RouteInstanceApi';
const { Title } = Typography;

export default function RouteInstanceCrudPage() {
  const [routeInstances, setRouteInstances] = useState<RouteInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RouteInstance | null>(null);

  async function fetchRouteInstances() {
    setLoading(true);
    try {
      setRouteInstances(await getRouteInstances());
    } catch (e: any) {
      message.error(e.message || 'Lỗi tải danh sách route instance');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRouteInstances();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(routeInstance: RouteInstance) {
    setEditing(routeInstance);
    setModalOpen(true);
  }

  async function handleSubmit(data: Partial<RouteInstance>) {
    try {
      if (editing && editing.id) {
        await updateRouteInstance(editing.id, data);
        message.success('Cập nhật route instance thành công');
      } else {
        await createRouteInstance(data);
        message.success('Tạo route instance thành công');
      }
      setModalOpen(false);
      fetchRouteInstances();
    } catch (e: any) {
      message.error(e.message || 'Lỗi khi lưu route instance');
    }
  }

  async function handleDelete(id: number) {
    Modal.confirm({
      title: 'Xác nhận xóa route instance?',
      onOk: async () => {
        try {
          await deleteRouteInstance(id);
          message.success('Đã xóa route instance');
          fetchRouteInstances();
        } catch (e: any) {
          message.error(e.message || 'Lỗi khi xóa route instance');
        }
      },
    });
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'ID mẫu lộ trình', dataIndex: 'route_template_id', key: 'route_template_id' },
    { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
    { title: 'Đã hoàn thành', dataIndex: 'is_finished', key: 'is_finished', render: (v: boolean) => v ? '✔️' : '❌' },
    { title: 'Tạo lúc', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RouteInstance) => (
        <Space>
          <Button onClick={() => openEdit(record)} type="link" icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} type="link" danger icon={<DeleteOutlined />} />
          <Button onClick={() => window.location.href = `/route-instance-detail/${record.id}`} type="link">View</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }} bordered={false}>
      <Row justify="center" align="middle">
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Quản lý Đi Tuyến</Title>
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm route instance</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={routeInstances}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 12 }}
        scroll={{ x: 900 }}
      />
      <Modal
        open={modalOpen}
        title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật route instance' : 'Thêm route instance'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        styles={{ body: { padding: 0, background: '#f9fafb', borderRadius: 12 } }}
      >
        <div className="p-6">
          <RouteInstanceForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
        </div>
      </Modal>
    </Card>
  );
}
