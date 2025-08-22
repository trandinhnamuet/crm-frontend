import { useEffect, useState } from 'react';
import { Card, Typography, Button, Upload, Image, Spin, Row, Col, message } from 'antd';
import { CameraOutlined, CheckCircleOutlined, LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import RouteInstanceCustomerService from '../../services/RouteInstanceCustomer.service';

const { Title, Text } = Typography;

export default function RouteInstanceCustomerDetail() {
  const [note, setNote] = useState('');
  const { routeInstanceCustomerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (routeInstanceCustomerId) {
      fetchCustomerDetail();
      fetchImages();
    }
  }, [routeInstanceCustomerId]);

  const fetchCustomerDetail = async () => {
    try {
      const data = await RouteInstanceCustomerService.get(Number(routeInstanceCustomerId));
      setCustomer(data);
      setNote(data.note || '');
    } catch (error) {
      console.error('Failed to fetch customer detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const imageList = await RouteInstanceCustomerService.getImagesByRouteInstanceCustomer(Number(routeInstanceCustomerId));
      setImages(imageList);
    } catch (error) {
      setImages([]);
      console.error('Failed to fetch images:', error);
    }
  };

  const handleUploadImage = async (file: File) => {
    setUploading(true);
    try {
      await RouteInstanceCustomerService.uploadImage(file, Number(routeInstanceCustomerId));
      fetchImages(); // Refresh images list
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload ảnh thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleCheckin = async () => {
    if (!routeInstanceCustomerId) return;
    try {
      await RouteInstanceCustomerService.update(Number(routeInstanceCustomerId), {
        checkin_at: new Date().toISOString(),
        note,
      });
      message.success('Checkin thành công!');
      fetchCustomerDetail();
    } catch (error) {
      message.error('Checkin thất bại!');
    }
  };

  const handleCheckout = async () => {
    if (!routeInstanceCustomerId) return;
    try {
      await RouteInstanceCustomerService.update(Number(routeInstanceCustomerId), {
        checkout_at: new Date().toISOString(),
        is_visited: true,
        note,
      });
      message.success('Checkout thành công!');
      fetchCustomerDetail();
    } catch (error) {
      message.error('Checkout thất bại!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Text>Không tìm thấy thông tin khách hàng</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>{customer.customer?.name}</Title>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Địa chỉ: </Text>
          <Text>{customer.customer?.address}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Số điện thoại: </Text>
          <Text>{customer.customer?.phone_number}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Email: </Text>
          <Text>{customer.customer?.email}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Trạng thái: </Text>
          {(!customer.checkin_at) && (
            <Text style={{ color: '#ff4d4f' }}>Chưa thăm</Text>
          )}
          {(customer.checkin_at && !customer.checkout_at) && (
            <Text style={{ color: '#faad14' }}>Đã checkin, chưa checkout</Text>
          )}
          {(customer.checkin_at && customer.checkout_at) && (
            <Text style={{ color: '#52c41a' }}>Đã thăm</Text>
          )}
        </div>
      </Card>

      <Card title="Ghi chú" style={{ marginBottom: 24 }}>
        <textarea
          placeholder="Nhập ghi chú..."
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ width: '100%', minHeight: 60, borderRadius: 6, border: '1px solid #d9d9d9', padding: 8, resize: 'vertical' }}
          disabled={!!customer?.checkout_at}
        />
      </Card>

      <Card title="Hành động" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={(file) => {
              handleUploadImage(file);
              return false;
            }}
            disabled={uploading}
          >
            <Button
              icon={<CameraOutlined />}
              type="primary"
              loading={uploading}
              style={{ background: '#722ed1', borderColor: '#722ed1' }}
            >
              Chụp/Chọn ảnh
            </Button>
          </Upload>
          <Button
            icon={<CheckCircleOutlined />}
            type="primary"
            style={{ 
              background: customer?.checkin_at ? '#d9d9d9' : '#52c41a',
              borderColor: customer?.checkin_at ? '#d9d9d9' : '#52c41a',
              color: customer?.checkin_at ? '#888' : undefined
            }}
            onClick={handleCheckin}
            disabled={!!customer?.checkin_at}
          >
            Checkin
          </Button>
          <Button
            icon={<LogoutOutlined />}
            type="primary"
            style={{ 
              background: customer?.checkout_at ? '#d9d9d9' : '#1677ff',
              borderColor: customer?.checkout_at ? '#d9d9d9' : '#1677ff',
              color: customer?.checkout_at ? '#888' : undefined
            }}
            onClick={handleCheckout}
            disabled={!!customer?.checkout_at}
          >
            Checkout
          </Button>
        </div>
      </Card>

      <Card title={`Danh sách ảnh (${images.length})`}>
        {images.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 20 }}>
            Chưa có ảnh nào được tải lên
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {images.map((image) => (
              <Col key={image.id} xs={12} sm={8} md={6} lg={4}>
                <Image
                  src={image.link}
                  alt={`Ảnh ${image.id}`}
                  style={{ width: '100%', borderRadius: 8 }}
                  preview={{
                    mask: <div style={{ fontSize: 12 }}>Xem</div>
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#666' }}>
                  ID: {image.id}
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </div>
  );
}
