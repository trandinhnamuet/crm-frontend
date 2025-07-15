
import { useRef, useState, useEffect } from "react";
import './App.css';

// Add types for google.maps to avoid TypeScript errors
type GoogleMap = any;
type GoogleMarker = any;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [lat, setLat] = useState<string>("21.0285");
  const [lng, setLng] = useState<string>("105.8542");
  // Hiện vị trí hiện tại
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude.toString());
        setLng(pos.coords.longitude.toString());
      });
    }
  }, []);
  const [note, setNote] = useState<string>("");
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [marker, setMarker] = useState<GoogleMarker | null>(null);

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
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: 15,
      });
      setMap(gmap);
      const gmarker = new (window as any).google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: gmap,
        title: note || "Marker",
      });
      setMarker(gmarker);
    }
  }

  // Move marker and map
  function goToLocation(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!map) return;
    const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
    map.setCenter(position);
    if (marker) {
      marker.setPosition(position);
      marker.setTitle(note || "Marker");
    } else if ((window as any).google) {
      const gmarker = new (window as any).google.maps.Marker({
        position,
        map,
        title: note || "Marker",
      });
      setMarker(gmarker);
    }
    if (note && (window as any).google) {
      const infowindow = new (window as any).google.maps.InfoWindow({
        content: note,
      });
      marker?.addListener("click", () => infowindow.open(map, marker));
      infowindow.open(map, marker!);
    }
  }

  // Init map on first render
  useEffect(() => {
    initMap();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-2 text-gray-700 text-lg font-semibold">
        Tọa độ hiện tại: <span className="text-blue-700">{lat}</span>, <span className="text-blue-700">{lng}</span>
      </div>
      <form
        className="flex gap-2 mb-4"
        onSubmit={goToLocation}
        autoComplete="off"
      >
        <input
          type="number"
          step="any"
          placeholder="Vĩ độ (lat)"
          className="px-3 py-2 rounded border"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Kinh độ (lng)"
          className="px-3 py-2 rounded border"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ghi chú mốc"
          className="px-3 py-2 rounded border"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Đến vị trí
        </button>
      </form>
      <div
        ref={mapRef}
        className="w-full max-w-2xl h-[500px] rounded shadow border"
      />
    </div>
  );
}
