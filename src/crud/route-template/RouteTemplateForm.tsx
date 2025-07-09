import React, { useEffect } from 'react';
import { Form, Input, Button, Space, InputNumber, Switch } from 'antd';
import type { RouteTemplate } from './RouteTemplateApi';
import dayjs from 'dayjs';

interface RouteTemplateFormProps {
  initial?: Partial<RouteTemplate>;
  onSubmit: (data: Partial<RouteTemplate>) => void;
  onCancel?: () => void;
}

export default function RouteTemplateForm({ initial = {}, onSubmit, onCancel }: RouteTemplateFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    // Convert ISO date (YYYY-MM-DD) to dd-mm-yyyy string for input
    const toDisplay = (d?: string) => {
      if (!d) return '';
      const parsed = dayjs(d, ["YYYY-MM-DD", "DD-MM-YYYY"]);
      return parsed.isValid() ? parsed.format("DD-MM-YYYY") : d;
    };
    form.setFieldsValue({
      ...initial,
      start_date: toDisplay(initial.start_date),
      end_date: toDisplay(initial.end_date),
    });
  }, [initial, form]);

  const handleFinish = (values: any) => {
    // Convert dd-mm-yyyy string to ISO yyyy-mm-dd for backend
    const toISO = (d?: string) => {
      if (!d) return undefined;
      const parsed = dayjs(d, ["DD-MM-YYYY", "YYYY-MM-DD"]);
      return parsed.isValid() ? parsed.format("YYYY-MM-DD") : d;
    };
    onSubmit({
      ...values,
      start_date: toISO(values.start_date),
      end_date: toISO(values.end_date),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
      initialValues={initial}
    >
      <div>
        <Form.Item name="code" label="Mã lộ trình">
          <Input placeholder="Mã lộ trình" />
        </Form.Item>
        <Form.Item name="name" label="Tên lộ trình" rules={[{ required: true, message: 'Vui lòng nhập tên lộ trình' }]}> 
          <Input placeholder="Tên lộ trình" />
        </Form.Item>
        <Form.Item name="start_date" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}> 
          <Input placeholder="dd-mm-yyyy" />
        </Form.Item>
        <Form.Item name="end_date" label="Ngày kết thúc"> 
          <Input placeholder="dd-mm-yyyy" />
        </Form.Item>
        <Form.Item name="repeat_type" label="Kiểu lặp lại" rules={[{ required: true, message: 'Vui lòng nhập kiểu lặp lại' }]}> 
          <Input placeholder="weekly, monthly..." />
        </Form.Item>
        <Form.Item name="repeat_on" label="Số tuần/ngày lặp lại">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="is_active" label="Hoạt động" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </div>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">Lưu</Button>
          {onCancel && <Button onClick={onCancel}>Hủy</Button>}
        </Space>
      </Form.Item>
    </Form>
  );
}
