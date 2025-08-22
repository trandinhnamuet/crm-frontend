import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Table, Button, Modal, message, Space, Card, Row, Col, Typography } from 'antd';
import CardList from '../../common/CardList';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import RouteInstanceForm from './RouteInstanceForm';
import { getRouteInstances, createRouteInstance, updateRouteInstance, deleteRouteInstance } from './RouteInstanceApi';
import type { RouteInstance } from './RouteInstanceApi';
const { Title } = Typography;

export default function RouteInstanceCrudPage() {
  const [routeInstances, setRouteInstances] = useState<RouteInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RouteInstance | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  async function fetchRouteInstances() {
    setLoading(true);
    try {
      const data = await getRouteInstances();
      setRouteInstances(data.sort((a, b) => b.id - a.id));
    } catch (e: any) {
      message.error(e.message || 'Lỗi tải danh sách route instance');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRouteInstances();
  }, []);

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

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'ID mẫu lộ trình', dataIndex: 'route_template_id', key: 'route_template_id' },
    { title: 'Tên lộ trình', key: 'route_template_name', render: (_: any, record: RouteInstance) => record.route_template?.name || '' },
    { title: 'Code', key: 'route_template_code', render: (_: any, record: RouteInstance) => record.route_template?.code || '' },
    { title: 'Repeat type', key: 'route_template_repeat_type', render: (_: any, record: RouteInstance) => record.route_template?.repeat_type || '' },
    { title: 'Người phụ trách', key: 'assignedEmployee', render: (_: any, record: RouteInstance) => record.assignedEmployee?.fullname || '' },
    { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date', render: (v: string) => v ? formatDate(v) : '' },
    { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date', render: (v: string) => v ? formatDate(v) : '' },
    { title: 'Đã hoàn thành', dataIndex: 'is_finished', key: 'is_finished', render: (v: boolean) => v ? '✔️' : '❌' },
    { title: 'Tạo lúc', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleString() : '' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RouteInstance) => (
        <Space>
          <Button onClick={(e) => { e.stopPropagation(); window.location.href = `/route-instance-detail/${record.id}`; }} type="link" icon={<EyeOutlined />} />
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
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Quản lý Đi Tuyến</Title>
        </Col>
      </Row>
      {isMobile ? (
        <CardList
          data={routeInstances}
          fields={[
            { label: 'Tên lộ trình', render: (item) => item.route_template?.name || '' },
            { label: 'ID', render: (item) => item.id },
            { label: 'Code', render: (item) => item.route_template?.code || '' },
            { label: 'Repeat type', render: (item) => item.route_template?.repeat_type || '' },
            { label: 'Người phụ trách', render: (item) => item.assignedEmployee?.fullname || '' },
            { label: 'Ngày bắt đầu', render: (item) => item.start_date ? formatDate(item.start_date) : '' },
            { label: 'Ngày kết thúc', render: (item) => item.end_date ? formatDate(item.end_date) : '' },
            { label: 'Đã hoàn thành', render: (item) => item.is_finished ? '✔️' : '❌' },
            { label: 'Tạo lúc', render: (item) => item.created_at ? new Date(item.created_at).toLocaleString() : '' },
          ]}
          actions={(item) => <>
            <Button onClick={(e) => { e.stopPropagation(); window.location.href = `/route-instance-detail/${item.id}`; }} type="link" icon={<EyeOutlined />} />
            <Button onClick={(e) => { e.stopPropagation(); openEdit(item); }} type="link" icon={<EditOutlined />} />
            <Button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} type="link" danger icon={<DeleteOutlined />} />
          </>}
          cardProps={(item) => ({
            onClick: () => window.location.href = `/route-instance-detail/${item.id}`,
            style: { cursor: 'pointer' },
          })}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={routeInstances}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 12 }}
          scroll={{ x: 900 }}
          onRow={(record) => ({
            onClick: () => window.location.href = `/route-instance-detail/${record.id}`,
            style: { cursor: 'pointer' },
          })}
        />
      )}
      <Modal
        open={modalOpen}
        title={<span className="text-xl font-semibold text-blue-600">{editing ? 'Cập nhật route instance' : 'Thêm route instance'}</span>}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
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
