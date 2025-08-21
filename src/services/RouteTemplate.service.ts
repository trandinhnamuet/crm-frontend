import { HttpService } from '@services/httpService';

const API_URL = `${import.meta.env.VITE_API_URL}/route-templates`;
const httpService = new HttpService(API_URL);

class RouteTemplateService {
	static getAll() {
		return httpService.get('/');
	}

	static get(id: number) {
		return httpService.get(`/${id}`);
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

export default RouteTemplateService;
