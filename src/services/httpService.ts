export class HttpService {
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
		const url = `${this.baseURL}${endpoint}`;
		
		const defaultHeaders = {
			'Content-Type': 'application/json',
		};

		const config: RequestInit = {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers,
			},
		};

		try {
			const response = await fetch(url, config);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			return await response.json();
		} catch (error) {
			console.error('HTTP request failed:', error);
			throw error;
		}
	}

	async get(endpoint: string): Promise<any> {
		return this.request(endpoint, {
			method: 'GET',
		});
	}

	async post(endpoint: string, data?: any): Promise<any> {
		return this.request(endpoint, {
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put(endpoint: string, data?: any): Promise<any> {
		return this.request(endpoint, {
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete(endpoint: string): Promise<any> {
		return this.request(endpoint, {
			method: 'DELETE',
		});
	}
}
