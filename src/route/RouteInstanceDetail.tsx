import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Upload, Button, Modal, Tag } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GoogleAPIService from '../services/GoogleAPI.service';
import RouteInstanceCustomerService from '../services/RouteInstanceCustomer.service';
const { Title } = Typography;

export default function RouteInstanceDetail() {
  const navigate = useNavigate();
  // Tọa độ gốc để tính khoảng cách
  const baseLat = 21.059837298011082;
  const baseLng = 105.70958174452157;

  function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    // Haversine formula
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [note, setNote] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [distances, setDistances] = useState<{[id: number]: string}>({});
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  // Lấy vị trí hiện tại của người dùng
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // Get routeInstanceId from URL
  const routeInstanceId = window.location.pathname.split('/').pop();

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        // Get route instance customers directly
        const routeInstanceCustomers = await RouteInstanceCustomerService.getByRouteInstance(Number(routeInstanceId));
        
        // Extract customer data from route instance customers
        let customers = routeInstanceCustomers.map((ric: any) => ({
          ...ric.customer,
          route_instance_customer_id: ric.id,
          is_visited: ric.is_visited,
          checkin_at: ric.checkin_at,
          checkout_at: ric.checkout_at,
          note: ric.note
        }));

        // Sắp xếp theo is_visited (false -> true), sau đó theo khoảng cách chim bay
        customers = customers.sort((a: any, b: any) => {
          if (a.is_visited !== b.is_visited) {
            return a.is_visited ? 1 : -1;
          }
          if (a.latitude && a.longitude && b.latitude && b.longitude) {
            const distA = calcDistance(baseLat, baseLng, a.latitude, a.longitude);
            const distB = calcDistance(baseLat, baseLng, b.latitude, b.longitude);
            return distA - distB;
          }
          return 0;
        });

        setCustomers(customers);
        // Center map to first customer if exists
        if (customers.length > 0 && customers[0].latitude && customers[0].longitude) {
          setLat(customers[0].latitude);
          setLng(customers[0].longitude);
        }
        // Lấy khoảng cách xe máy cho từng customer
        const newDistances: {[id: number]: string} = {};
        const API_URL = import.meta.env.VITE_API_URL;
        await Promise.all(customers.map(async (c: any) => {
          if (c.latitude && c.longitude) {
            try {
              const res = await fetch(`${API_URL}/google-map/directions?origin=${baseLat},${baseLng}&destination=${c.latitude},${c.longitude}&mode=driving`);
              const result = await res.json();
              if (result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
                newDistances[c.id] = result.routes[0].legs[0].distance.text;
              }
            } catch {}
          }
        }));
        setDistances(newDistances);
      } catch {
        setCustomers([]);
      }
      setLoading(false);
    }
    fetchCustomers();
  }, [routeInstanceId]);



  // Init map
  useEffect(() => {
    async function initMap() {
      if (lat && lng) {
        await GoogleAPIService.loadJsApi();
        if (mapRef.current && (window as any).google) {
          const gmap = new (window as any).google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 13,
          });
          const bounds = new (window as any).google.maps.LatLngBounds();
          customers.forEach((c) => {
            if (c.latitude && c.longitude) {
              let icon = undefined;
              if (c.is_visited) {
                icon = {
                  path: (window as any).google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#52c41a',
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: '#388e3c',
                };
              }
              const marker = new (window as any).google.maps.Marker({
                position: { lat: c.latitude, lng: c.longitude },
                map: gmap,
                title: c.name,
                ...(icon ? { icon } : {}),
              });
              bounds.extend({ lat: c.latitude, lng: c.longitude });
              const infowindow = new (window as any).google.maps.InfoWindow({
                content: `<b>${c.name}</b><br/>${c.address}`,
              });
              let isOpen = false;
              // Nếu chưa đi thì show popup mặc định
              if (!c.is_visited) {
                infowindow.open(gmap, marker);
                isOpen = true;
              }
              // Click: toggle popup
              marker.addListener("click", () => {
                if (isOpen) {
                  infowindow.close();
                  isOpen = false;
                } else {
                  infowindow.open(gmap, marker);
                  isOpen = true;
                }
              });
            }
          });
          // Cắm marker vị trí hiện tại của user
          if (userLocation) {
            const userMarker = new (window as any).google.maps.Marker({
              position: userLocation,
              map: gmap,
              title: 'Vị trí của bạn',
              icon: {
                path: (window as any).google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 7,
                fillColor: '#ff4d4f',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#d4380d',
              },
              zIndex: 999,
            });
            const userInfoWindow = new (window as any).google.maps.InfoWindow({
              content: `<b>Vị trí của bạn</b>`
            });
            userInfoWindow.open(gmap, userMarker);
            userMarker.addListener("click", () => userInfoWindow.open(gmap, userMarker));
            bounds.extend(userLocation);
          }
          if (!bounds.isEmpty()) {
            gmap.fitBounds(bounds);
            // Nếu có nhiều marker, giảm zoom đi 1 để tránh bị sát rìa
            if (customers.filter(c => c.latitude && c.longitude).length > 1) {
              (window as any).google.maps.event.addListenerOnce(gmap, 'bounds_changed', function() {
                gmap.setZoom(gmap.getZoom() - 1);
              });
            }
          }
        }
      }
    }
    initMap();
    // eslint-disable-next-line
  }, [lat, lng, customers, userLocation]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f6fa' }}>
      <div style={{ width: 350, overflowY: 'auto', background: '#fff', borderRight: '1px solid #eee', padding: 16 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Khách hàng theo lộ trình</Title>
        {loading ? <Spin /> : customers.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>Không có khách hàng nào</div>
        ) : (
          customers.map((c) => {
            let haversineDistance = '';
            let motorbikeDistance = '';
            if (c.latitude && c.longitude) {
              const d = calcDistance(baseLat, baseLng, c.latitude, c.longitude);
              haversineDistance = `${d.toFixed(2)} km`;
              motorbikeDistance = distances[c.id] || '';
            }
            return (
              <Card key={c.id} style={{ marginBottom: 12, cursor: 'pointer', position: 'relative' }} onClick={() => { 
                navigate(`/route-instance-customer/${c.route_instance_customer_id}`);
              }}>
                <div style={{ position: 'absolute', top: 8, right: 12, zIndex: 2 }}>
                  <Tag color={c.is_visited ? 'green' : 'red'}>{c.is_visited ? 'Đã đi' : 'Chưa đi'}</Tag>
                </div>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ color: '#555' }}>{c.address}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{c.phone_number}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{c.email}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div style={{ color: '#52c41a' }}>Khoảng cách chim bay: {haversineDistance || 'Đang tính...'}</div>
                  <div style={{ color: '#1677ff', marginTop: 2 }}>Khoảng cách xe máy: {motorbikeDistance || 'Đang tính...'}</div>
                </div>
              </Card>
            );
          })
        )}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Modal customer detail */}
      <Modal
        open={modalOpen && !!selectedCustomer}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={400}
        destroyOnClose
        title={selectedCustomer ? selectedCustomer.name : ''}
      >
        {selectedCustomer && (
          <>
            <div style={{ color: '#555', marginBottom: 8 }}>{selectedCustomer.address}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{selectedCustomer.phone_number}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{selectedCustomer.email}</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 500 }}>Ghi chú:</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{ width: '100%', minHeight: 60, marginTop: 4, borderRadius: 6, border: '1px solid #eee', padding: 8 }}
                placeholder="Nhập ghi chú..."
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 500 }}>Chụp/Up ảnh:</label>
              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={async (file) => {
                  setUploading(true);
                  try {
                    // Upload file to server
                    const uploadResult = await RouteInstanceCustomerService.uploadImage(file, selectedCustomer.id);
                    console.log('Upload result:', uploadResult);
                    
                    // Show image preview
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImageUrl(reader.result as string);
                      setUploading(false);
                    };
                    reader.readAsDataURL(file);
                  } catch (error) {
                    console.error('Upload failed:', error);
                    setUploading(false);
                    alert('Upload ảnh thất bại!');
                  }
                  return false; // prevent upload
                }}
                disabled={uploading}
              >
                <Button
                  icon={<CameraOutlined />}
                  type="primary"
                  style={{ marginTop: 8, width: '100%' }}
                  loading={uploading}
                >Chụp/Chọn ảnh</Button>
              </Upload>
              {imageUrl && (
                <img src={imageUrl} alt="Ảnh" style={{ width: '100%', marginTop: 8, borderRadius: 8 }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Button
                type="primary"
                style={{ flex: 1, background: '#52c41a', borderColor: '#52c41a', fontWeight: 600, fontSize: 16, padding: '10px 0' }}
                onClick={() => { alert('Checkin thành công!'); setModalOpen(false); }}
                disabled={uploading}
              >Checkin</Button>
              <Button
                type="primary"
                style={{ flex: 1, background: '#1677ff', borderColor: '#1677ff', fontWeight: 600, fontSize: 16, padding: '10px 0' }}
                onClick={() => { alert('Checkout thành công!'); setModalOpen(false); }}
                disabled={uploading}
              >Checkout</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
