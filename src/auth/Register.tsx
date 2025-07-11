
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Form, Input, Button, Typography } from "antd";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
  });
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Giả lập id, image_id, created_at
    const payload = {
      id: Math.floor(Math.random() * 10000),
      ...form,
      image_id: 1,
      created_at: new Date().toISOString(),
    };
    try {
      // Thay URL bằng API thực tế nếu có
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      antdMessage.success("Đăng ký thành công");
      setForm({
        username: "",
        password: "",
        fullname: "",
        phone_number: "",
        email: "",
        date_of_birth: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      antdMessage.error("Đăng ký thất bại");
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
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>Đăng ký</Typography.Title>
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
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item label="Họ và tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          initialValue={form.fullname}>
          <Input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          initialValue={form.phone_number}>
          <Input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            type="tel"
          />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          initialValue={form.email}>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="date_of_birth" rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
          initialValue={form.date_of_birth}>
          <Input
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            type="date"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            block
            onClick={() => navigate("/login")}
          >
            Đã có tài khoản? Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
