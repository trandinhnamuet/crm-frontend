
import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import type User from './User';

interface UserFormProps {
  initial?: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  onCancel?: () => void;
}

export default function UserForm({ initial = {}, onSubmit, onCancel }: UserFormProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
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
      <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập username' }]}> 
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: !initial.id, message: 'Vui lòng nhập password' }]}> 
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item name="fullname" label="Full name">
        <Input placeholder="Full name" />
      </Form.Item>
      <Form.Item name="phone_number" label="Phone number">
        <Input placeholder="Phone number" />
      </Form.Item>
      <Form.Item name="date_of_birth" label="Date of birth">
        <Input type="date" placeholder="Date of birth" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input placeholder="Email" />
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
