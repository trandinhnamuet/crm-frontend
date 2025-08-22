import { useEffect, useState } from 'react';
import { Form, Input, Button, Space, InputNumber, Switch, Select, message, Modal } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { Customer } from './CustomerApi';

interface CustomerFormProps {
  initial?: Partial<Customer>;
  onSubmit: (data: Partial<Customer>) => void;
  onCancel?: () => void;
}

export default function CustomerForm({ initial = {}, onSubmit, onCancel }: CustomerFormProps) {
  const [form] = Form.useForm();
  const [locationMethod, setLocationMethod] = useState<string>('current');
  const [googleMapLink, setGoogleMapLink] = useState<string>('');
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  useEffect(() => {
    form.setFieldsValue(initial);
  }, [initial, form]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setFieldsValue({
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6))
          });
          message.success('Đã lấy tọa độ vị trí hiện tại!');
        },
        (error) => {
          console.error('Error getting location:', error);
          message.error('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      message.error('Trình duyệt không hỗ trợ định vị GPS.');
    }
  };

  const parseGoogleMapLink = (link: string) => {
    try {
      // Các pattern phổ biến của Google Maps với độ chính xác cao hơn
      const patterns = [
        /@(-?\d+\.?\d+),(-?\d+\.?\d+)/, // @lat,lng - cải thiện để bắt nhiều số thập phân hơn
        /!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/, // !3dlat!4dlng - cải thiện độ chính xác
        /q=(-?\d+\.?\d+),(-?\d+\.?\d+)/, // q=lat,lng
        /ll=(-?\d+\.?\d+),(-?\d+\.?\d+)/, // ll=lat,lng
        /place\/.*@(-?\d+\.?\d+),(-?\d+\.?\d+)/, // place link format
        /data=.*!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/, // data format trong URL
      ];

      for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match) {
          return {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2])
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing Google Maps link:', error);
      return null;
    }
  };

  const handleGoogleMapLinkConfirm = () => {
    if (!googleMapLink.trim()) {
      message.error('Vui lòng nhập link Google Maps!');
      return;
    }

    const coordinates = parseGoogleMapLink(googleMapLink);
    if (coordinates) {
      form.setFieldsValue({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      });
      message.success('Đã trích xuất tọa độ từ link Google Maps!');
    } else {
      message.error('Link Google Maps không hợp lệ! Vui lòng kiểm tra lại.');
    }
  };

  const handleMapSelection = () => {
    setIsMapModalVisible(true);
  };

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <>
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
      
      <Form.Item label="Phương thức định vị">
        <Select
          value={locationMethod}
          onChange={setLocationMethod}
          options={[
            { value: 'current', label: 'Vị trí hiện tại/Nhập tọa độ' },
            { value: 'googlemap', label: 'Link Google Map' },
            { value: 'map', label: 'Chọn trên bản đồ' }
          ]}
        />
      </Form.Item>

      {locationMethod === 'current' && (
        <>
          <Form.Item label="Tọa độ">
            <Button
              icon={<EnvironmentOutlined />}
              onClick={getCurrentLocation}
              style={{ marginBottom: 8, width: '100%' }}
            >
              Lấy tọa độ vị trí hiện tại
            </Button>
          </Form.Item>
        </>
      )}

      {locationMethod === 'googlemap' && (
        <Form.Item label="Link Google Maps">
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 80px)' }}
              placeholder="Dán link Google Maps vào đây..."
              value={googleMapLink}
              onChange={(e) => setGoogleMapLink(e.target.value)}
            />
            <Button
              type="primary"
              style={{ width: '80px' }}
              onClick={handleGoogleMapLinkConfirm}
            >
              Xác nhận
            </Button>
          </Input.Group>
        </Form.Item>
      )}

      {locationMethod === 'map' && (
        <Form.Item label="Chọn vị trí">
          <Button
            icon={<EnvironmentOutlined />}
            onClick={handleMapSelection}
            style={{ width: '100%' }}
          >
            Mở bản đồ để chọn vị trí
          </Button>
        </Form.Item>
      )}

      <Form.Item name="latitude" label="Vĩ độ">
        <InputNumber 
          style={{ width: '100%' }} 
          placeholder="Vĩ độ" 
          step={0.0000001}
          precision={10}
          stringMode
        />
      </Form.Item>
      <Form.Item name="longitude" label="Kinh độ">
        <InputNumber 
          style={{ width: '100%' }} 
          placeholder="Kinh độ" 
          step={0.0000001}
          precision={10}
          stringMode
        />
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

    <Modal
      title="Chọn vị trí trên bản đồ"
      open={isMapModalVisible}
      onCancel={() => setIsMapModalVisible(false)}
      footer={null}
      width={800}
      destroyOnClose
    >
      <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', border: '2px dashed #d9d9d9' }}>
        <div style={{ textAlign: 'center' }}>
          <EnvironmentOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', color: '#666' }}>Tính năng bản đồ tương tác đang được phát triển</p>
          <p style={{ fontSize: '14px', color: '#999' }}>Hiện tại vui lòng sử dụng các phương thức khác</p>
          <Button onClick={() => setIsMapModalVisible(false)}>Đóng</Button>
        </div>
      </div>
    </Modal>
    </>
  );
}
