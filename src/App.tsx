import './App.css'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-500 to-pink-400">
      <h1 className="text-4xl font-bold text-white drop-shadow-lg">Tailwind CSS Test</h1>
      <div className="flex gap-4">
        <button className="bg-white text-blue-600 px-6 py-2 rounded shadow hover:bg-blue-100 transition">Nút trắng</button>
        <button className="bg-pink-500 text-white px-6 py-2 rounded shadow hover:bg-pink-400 transition">Nút hồng</button>
        <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded shadow">Gradient</button>
      </div>
      <div className="mt-6 p-4 rounded bg-white/80 text-gray-800 text-lg shadow">
        Nếu bạn thấy nền chuyển màu, chữ to trắng, nút đổi màu khi hover thì Tailwind đã hoạt động!
      </div>
    </div>
  );
}
