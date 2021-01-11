import axios from './axiosService';

export const signupService = data => {
	return axios.post('/api/auth/signup', data);
};

export const emailService = data => {
	return axios.post('/api/auth/email', data);
};

export const passwordService = data => {
	return axios.post('/api/auth/password', data);
};
