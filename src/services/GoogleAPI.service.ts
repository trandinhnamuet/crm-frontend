import { HttpService } from '@services/httpService';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_URL = 'https://maps.googleapis.com/maps/api';
const httpService = new HttpService(API_URL);

class GoogleAPIService {
	   static getJsApiUrl() {
		   return `${API_URL}/js?key=${GOOGLE_MAPS_API_KEY}`;
	   }

	static loadJsApi() {
		const src = GoogleAPIService.getJsApiUrl();
		if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
		return new Promise<void>((resolve) => {
			const script = document.createElement("script");
			script.src = src;
			script.async = true;
			script.onload = () => resolve();
			document.body.appendChild(script);
		});
	}
	static geocode(address: string) {
	    return httpService.get(`/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
	}

	static reverseGeocode(lat: number, lng: number) {
	    return httpService.get(`/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`);
	}

    //cant call this function due to frontend cant call api from google
	static directions(origin: string, destination: string, mode: string = 'two_wheeler') {
	    return httpService.get(`/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`);
	}

	static distanceMatrix(origins: string[], destinations: string[], mode: string = 'two_wheeler') {
	    return httpService.get(`/distancematrix/json?origins=${encodeURIComponent(origins.join('|'))}&destinations=${encodeURIComponent(destinations.join('|'))}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`);
	}
}

export default GoogleAPIService;
