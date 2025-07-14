import { useEffect } from 'react';
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
      <Form.Item name="phone_number" label="Số điện thoại">
        <Input placeholder="Số điện thoại" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="note" label="Ghi chú">
        <Input placeholder="Ghi chú" />
      </Form.Item>
      {/* Bỏ trường ID ảnh đại diện */}
      <Form.Item name="address" label="Địa chỉ">
        <Input placeholder="Địa chỉ" />
      </Form.Item>
      <Form.Item name="latitude" label="Vĩ độ">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="longitude" label="Kinh độ">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      {/* Bỏ trường ID người tạo */}
      {/* Bỏ các trường thời điểm tạo, id người cập nhật, thời điểm cập nhật, thời điểm xóa, id người xóa */}
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
