import { HttpService } from '@services/httpService';

const API_URL = `${import.meta.env.VITE_API_URL}/route-instance-customers`;
const httpService = new HttpService(API_URL);


class RouteInstanceCustomerService {
	static getAll() {
		return httpService.get('/');
	}

	static get(id: number) {
		return httpService.get(`/${id}`);
	}

	static getByRouteInstance(routeInstanceId: number) {
		return httpService.get(`/by-route-instance/${routeInstanceId}`);
	}

	static getByCustomer(customerId: number) {
		return httpService.get(`/by-customer/${customerId}`);
	}

	static create(data: any) {
		return httpService.post('/', data);
	}

	static update(id: number, data: any) {
		return httpService.put(`/${id}`, data);
	}

	static delete(id: number) {
		return httpService.delete(`/${id}`);
	}

	static async getImagesByRouteInstanceCustomer(routeInstanceCustomerId: number) {
		const res = await fetch(`${import.meta.env.VITE_API_URL}/images/link/route_instance_customer/${routeInstanceCustomerId}`);
		return await res.json();
	}

	static uploadImage(file: File, routeInstanceCustomerId: number) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('route_instance_customer_id', routeInstanceCustomerId.toString());
		
		return fetch(`${import.meta.env.VITE_API_URL}/route-instance-customer-images/upload`, {
			method: 'POST',
			body: formData,
		}).then(response => response.json());
	}
}

export default RouteInstanceCustomerService;
