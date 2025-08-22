import { useRef, useEffect, useState } from "react";
import './App.css';
import { Button, Layout } from 'antd';
import CustomerService from './services/Customer.service';

// Add types for google.maps to avoid TypeScript errors
type GoogleMap = any;
type GoogleMarker = any;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);

export default function App() {
  const { Content } = Layout;
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [marker, setMarker] = useState<GoogleMarker | null>(null);
  const [customerMarkers, setCustomerMarkers] = useState<any[]>([]);

  // Hà Nội mặc định
  const lat = 21.0285;
  const lng = 105.8542;

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

  // Initialize map
  async function initMap() {
    await loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
    );
    if (mapRef.current && !map && (window as any).google) {
      const gmap = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
      });
      setMap(gmap);
      // Marker trung tâm (có thể bỏ nếu không cần)
      const gmarker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map: gmap,
        title: "Marker",
      });
      setMarker(gmarker);

      // Lấy danh sách customer và cắm mốc
      try {
        const customers = await CustomerService.getAll();
        const validCustomers = customers.filter((c: any) => c.latitude && c.longitude);
        const bounds = new (window as any).google.maps.LatLngBounds();
        const markers = validCustomers.map((c: any) => {
          const pos = { lat: c.latitude, lng: c.longitude };
          const m = new (window as any).google.maps.Marker({
            position: pos,
            map: gmap,
            title: c.name,
          });
          const infowindow = new (window as any).google.maps.InfoWindow({
            content: `<b>${c.name}</b><br/>${c.address}`
          });
          m.addListener('click', () => {
            infowindow.open(gmap, m);
          });
          bounds.extend(pos);
          return m;
        });
        if (validCustomers.length > 0) {
          gmap.fitBounds(bounds);
        }
        setCustomerMarkers(markers);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Không lấy được danh sách customer', e);
      }
    }
  }

  // Init map on first render
  useEffect(() => {
    initMap();
    // eslint-disable-next-line
  }, []);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <div ref={mapRef} style={{ width: '82%', height: '85%' }} />
      </div>
    );
}