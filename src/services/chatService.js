import axios from './axiosService';

export const receivedChatService = () => {
	return axios.get('/api/chat');
};

export const makeChatService = data => {
	return axios.post('/api/chat', data);
};

export const threadChatMessagesService = userId => {
	return axios.get(`/api/chat/${userId}/thread`);
};

export const deleteEmptyChat = () => {
	return axios.delete('/api/chat');
};
