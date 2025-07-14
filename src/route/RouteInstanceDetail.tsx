import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Upload, Button as AntButton } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
const { Title } = Typography;

const GOOGLE_MAPS_API_KEY = "AIzaSyB8ayzTBAkoH_jK_lFe9iHaOX1K3L5NVMw";

export default function RouteInstanceDetail() {
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

  // Get routeInstanceId from URL
  const routeInstanceId = window.location.pathname.split('/').pop();

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        // Get route instance info
        const routeRes = await fetch(`${API_URL}/route-instances/${routeInstanceId}`);
        const routeData = routeRes.ok ? await routeRes.json() : null;
        // Get mapped customers by template id
        if (routeData && routeData.route_template_id) {
          const res = await fetch(`${API_URL}/customers/by-route-template/${routeData.route_template_id}`);
          const data = res.ok ? await res.json() : [];
          setCustomers(data);
          // Center map to first customer if exists
          if (data.length > 0 && data[0].latitude && data[0].longitude) {
            setLat(data[0].latitude);
            setLng(data[0].longitude);
          }
          // Lấy khoảng cách xe máy cho từng customer
          const newDistances: {[id: number]: string} = {};
          await Promise.all(data.map(async (c: any) => {
            if (c.latitude && c.longitude) {
              try {
                const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${baseLat},${baseLng}&destination=${c.latitude},${c.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
                const res = await fetch(url);
                const result = await res.json();
                if (result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
                  newDistances[c.id] = result.routes[0].legs[0].distance.text;
                }
              } catch {}
            }
          }));
          setDistances(newDistances);
        } else {
          setCustomers([]);
        }
      } catch {
        setCustomers([]);
      }
      setLoading(false);
    }
    fetchCustomers();
  }, [routeInstanceId]);

  // Load Google Maps script
  function loadScript(src: string) {
    return new Promise<void>((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  // Init map
  useEffect(() => {
    async function initMap() {
      if (lat && lng) {
        await loadScript(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`);
        if (mapRef.current && (window as any).google) {
          const gmap = new (window as any).google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 13,
          });
          customers.forEach((c) => {
            if (c.latitude && c.longitude) {
              let icon = undefined;
              if (c.id % 2 === 1) {
                icon = {
                  path: (window as any).google.maps.SymbolPath.CIRCLE ,
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
                icon,
              });
              const infowindow = new (window as any).google.maps.InfoWindow({
                content: `<b>${c.name}</b><br/>${c.address}`,
              });
              // Show info window by default
              infowindow.open(gmap, marker);
              marker.addListener("click", () => infowindow.open(gmap, marker));
            }
          });
        }
      }
    }
    initMap();
    // eslint-disable-next-line
  }, [lat, lng, customers]);

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
              <Card key={c.id} style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => { setSelectedCustomer(c); setNote(''); setImageUrl(null); setModalOpen(true); }}>
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
      {selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: modalOpen ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 12, minWidth: 350, maxWidth: 400, padding: 24, boxShadow: '0 2px 16px #0002' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>{selectedCustomer.name}</div>
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
                beforeUpload={file => {
                  setUploading(true);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageUrl(reader.result as string);
                    setUploading(false);
                  };
                  reader.readAsDataURL(file);
                  return false; // prevent upload
                }}
                disabled={uploading}
              >
                <AntButton
                  icon={<CameraOutlined />}
                  type="primary"
                  style={{ marginTop: 8, width: '100%' }}
                  loading={uploading}
                >Chụp/Chọn ảnh</AntButton>
              </Upload>
              {imageUrl && (
                <img src={imageUrl} alt="Ảnh" style={{ width: '100%', marginTop: 8, borderRadius: 8 }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                style={{ flex: 1, background: '#52c41a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                onClick={() => { alert('Checkin thành công!'); setModalOpen(false); }}
                disabled={uploading}
              >Checkin</button>
              <button
                style={{ flex: 1, background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                onClick={() => { alert('Checkout thành công!'); setModalOpen(false); }}
                disabled={uploading}
              >Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
