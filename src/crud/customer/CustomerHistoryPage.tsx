import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, Card, Typography, Image, Tag } from 'antd';
import RouteInstanceCustomerService from '../../services/RouteInstanceCustomer.service';

const { Title } = Typography;

export default function CustomerHistoryPage() {
  const { customerId } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageMap, setImageMap] = useState<{[key: number]: any[]}>({});

  useEffect(() => {
    if (customerId) {
      fetchData();
    }
  }, [customerId]);

  const fetchData = async () => {
    try {
      const result = await RouteInstanceCustomerService.getByCustomer(Number(customerId));
      setData(result);
      
      // Fetch images for each record
      const imagePromises = result.map(async (record: any) => {
        try {
          const images = await RouteInstanceCustomerService.getImagesByRouteInstanceCustomer(record.id);
          return { recordId: record.id, images };
        } catch (error) {
          return { recordId: record.id, images: [] };
        }
      });
      
      const imageResults = await Promise.all(imagePromises);
      const newImageMap: {[key: number]: any[]} = {};
      imageResults.forEach(({ recordId, images }) => {
        newImageMap[recordId] = images;
      });
      setImageMap(newImageMap);
    } catch (error) {
      console.error('Failed to fetch customer history:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tuyến',
      key: 'route_name',
      render: (record: any) => record.route_instance?.route_template?.name || '-',
    },
    {
      title: 'Nhân viên phụ trách',
      key: 'assigned_employee',
      render: (record: any) => record.route_instance?.assignedEmployee?.fullname || '-',
    },
    {
      title: 'Giờ Checkin',
      dataIndex: 'checkin_at',
      key: 'checkin_at',
      render: (value: string) => value ? new Date(value).toLocaleString() : '-',
    },
    {
      title: 'Giờ Checkout',
      dataIndex: 'checkout_at',
      key: 'checkout_at',
      render: (value: string) => value ? new Date(value).toLocaleString() : '-',
    },
    {
      title: 'Đã thăm',
      dataIndex: 'is_visited',
      key: 'is_visited',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Đã thăm' : 'Chưa thăm'}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (value: string) => value || '-',
    },
    {
      title: 'Ảnh',
      key: 'images',
      render: (record: any) => {
        const images = imageMap[record.id] || [];
        if (images.length === 0) return '-';
        
        return (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {images.slice(0, 3).map((img: any) => (
              <Image
                key={img.id}
                src={img.link}
                alt={`Image ${img.id}`}
                width={40}
                height={40}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                preview={{
                  src: img.link
                }}
              />
            ))}
            {images.length > 3 && (
              <span style={{ fontSize: 12, color: '#666', alignSelf: 'center' }}>
                +{images.length - 3}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card style={{ margin: 24 }}>
      <Title level={2}>Lịch sử thăm khách hàng #{customerId}</Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
