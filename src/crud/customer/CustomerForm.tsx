import React, { useEffect } from 'react';
import { Form, Input, Button, Space, InputNumber, Switch } from 'antd';
import type { Customer } from './CustomerApi';

interface CustomerFormProps {
  initial?: Partial<Customer>;
  onSubmit: (data: Partial<Customer>) => void;
  onCancel?: () => void;
}

export default function CustomerForm({ initial = {}, onSubmit, onCancel }: CustomerFormProps) {
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
      <Form.Item name="code" label="Mã khách hàng">
        <Input placeholder="Mã khách hàng" />
      </Form.Item>
      <Form.Item name="name" label="Tên khách hàng">
        <Input placeholder="Tên khách hàng" />
      </Form.Item>
      <Form.Item name="address" label="Địa chỉ">
        <Input placeholder="Địa chỉ" />
      </Form.Item>
      <Form.Item name="phone_number" label="Số điện thoại">
        <Input placeholder="Số điện thoại" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="note" label="Ghi chú">
        <Input placeholder="Ghi chú" />
      </Form.Item>
      <Form.Item name="image_id" label="ID ảnh đại diện">
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="latitude" label="Vĩ độ">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="longitude" label="Kinh độ">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="created_by" label="ID người tạo">
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="created_at" label="Thời điểm tạo">
        <Input placeholder="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item name="updated_by" label="ID người cập nhật">
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="updated_at" label="Thời điểm cập nhật">
        <Input placeholder="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item name="deleted_by" label="ID người xóa">
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="deleted_at" label="Thời điểm xóa">
        <Input placeholder="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item name="is_active" label="Hoạt động" valuePropName="checked" initialValue={true}>
        <Switch />
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
