import { useEffect } from 'react';
import { Form, Input, Button, Space, InputNumber, Switch } from 'antd';
import type { RouteInstance } from './RouteInstanceApi';

interface RouteInstanceFormProps {
  initial?: Partial<RouteInstance>;
  onSubmit: (data: Partial<RouteInstance>) => void;
  onCancel?: () => void;
}

export default function RouteInstanceForm({ initial = {}, onSubmit, onCancel }: RouteInstanceFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initial);
  }, [initial, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
      initialValues={initial}
    >
      <Form.Item name="route_template_id" label="ID mẫu lộ trình">
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="start_date" label="Ngày bắt đầu">
        <Input placeholder="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item name="end_date" label="Ngày kết thúc">
        <Input placeholder="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item name="is_finished" label="Đã hoàn thành" valuePropName="checked" initialValue={false}>
        <Switch />
      </Form.Item>
      <Form.Item name="created_at" label="Thời điểm tạo">
        <Input placeholder="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">Lưu</Button>
          {onCancel && <Button onClick={onCancel}>Hủy</Button>}
        </Space>
      </Form.Item>
    </Form>
  );
}
