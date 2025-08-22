import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, message, Spin, Card } from 'antd';
import UserService from '../../services/User.service';
import dayjs from 'dayjs';

const dateFormat = 'DD-MM-YYYY';

const UserDetail = () => {
	const { id } = useParams();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<any>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (id) {
			setLoading(true);
			UserService.get(Number(id))
				.then((res: any) => {
                    console.log(res)
					setUser(res);
					form.setFieldsValue({
						...res,
						date_of_birth: res.date_of_birth ? dayjs(res.date_of_birth) : undefined,
					});
				})
				.catch(() => message.error('Không lấy được thông tin user'))
				.finally(() => setLoading(false));
		}
	}, [id, form]);

	const onFinish = (values: any) => {
		setSaving(true);
		const submitData = {
			...values,
			date_of_birth: values.date_of_birth ? values.date_of_birth.format('DD-MM-YYYY') : null,
		};
			UserService.update(Number(id), submitData)
				.then(() => {
					message.success('Cập nhật thành công');
					// Không chuyển trang, chỉ hiện thông báo
				})
				.catch(() => message.error('Cập nhật thất bại'))
				.finally(() => setSaving(false));
	};

	if (loading) return <Spin style={{ marginTop: 40 }} />;
	if (!user) return null;

	return (
		<Card title={`Thông tin người dùng: ${user.fullname || user.username}`} style={{ maxWidth: 500, margin: '24px auto' }}>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{ ...user, date_of_birth: user.date_of_birth ? dayjs(user.date_of_birth) : undefined }}
			>
				{/* Ảnh đại diện nếu có */}
				{user.image_url && (
					<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
						<img 
							src={user.image_url} 
							alt="avatar" 
							style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} 
						/>
					</div>
				)}
				<div style={{ display: 'flex', gap: 16 }}>
					<div style={{ flex: 1 }}>
						<Form.Item label="Tên đăng nhập" name="username">
							<Input disabled />
						</Form.Item>
						<Form.Item label="Họ tên" name="fullname" rules={[{ required: true, message: 'Nhập họ tên' }]}> 
							<Input />
						</Form.Item>
						<Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}> 
							<Input.Password autoComplete="new-password" />
						</Form.Item>
						<Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}> 
							<Input />
						</Form.Item>
					</div>
					<div style={{ flex: 1 }}>
						<Form.Item label="Số điện thoại" name="phone_number"> 
							<Input />
						</Form.Item>
						<Form.Item label="Ngày sinh" name="date_of_birth">
							<DatePicker format={dateFormat} style={{ width: '100%' }} allowClear />
						</Form.Item>
						<Form.Item label="Ngày tạo" name="created_at">
							<Input value={user.created_at ? dayjs(user.created_at).format('DD-MM-YYYY HH:mm') : ''} disabled />
						</Form.Item>
					</div>
				</div>
				<Form.Item style={{ marginTop: 24 }}>
					<Button type="primary" htmlType="submit" loading={saving} block>
						Lưu thay đổi
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default UserDetail;
