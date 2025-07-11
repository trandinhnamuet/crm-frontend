

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { message as antdMessage, Form, Input, Button, Typography } from "antd";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [form, setForm] = useState({ username: "", password: "" });
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        antdMessage.error(err.message || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }
      const user = await res.json();
      setUser(user);
      // Lưu id user vào localStorage
      localStorage.setItem("userId", user.id.toString());
      antdMessage.success("Đăng nhập thành công");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      antdMessage.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form
        style={{ background: 'white', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #eee', width: '100%', maxWidth: 400 }}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>Đăng nhập</Typography.Title>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Vui lòng nhập username' }]}
          initialValue={form.username}>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Vui lòng nhập password' }]}
          initialValue={form.password}>
          <Input.Password
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            block
            onClick={() => navigate("/register")}
          >
            Chưa có tài khoản? Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
