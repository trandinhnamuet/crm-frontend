import { HttpService } from '@services/httpService';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
const httpService = new HttpService(API_URL);

class AuthService {
	static login(data: { username: string; password: string }) {
		return httpService.post('/', data);
	}
}

export default AuthService;
