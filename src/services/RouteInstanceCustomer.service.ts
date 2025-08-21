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

	static create(data: any) {
		return httpService.post('/', data);
	}

	static update(id: number, data: any) {
		return httpService.put(`/${id}`, data);
	}

	static delete(id: number) {
		return httpService.delete(`/${id}`);
	}
}

export default RouteInstanceCustomerService;
