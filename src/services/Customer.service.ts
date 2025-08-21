import { HttpService } from '@services/httpService';

const API_URL = `${import.meta.env.VITE_API_URL}/customers`;
const httpService = new HttpService(API_URL);

class CustomerService {
	static getAll() {
		return httpService.get('/');
	}

	static get(id: number) {
		return httpService.get(`/${id}`);
	}

	static getByRouteTemplate(routeTemplateId: number) {
		return httpService.get(`/by-route-template/${routeTemplateId}`);
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

export default CustomerService;
