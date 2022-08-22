import { Base64 } from 'js-base64';

export const setItem = (key, value) => {
	localStorage.setItem(Base64.encode(key), Base64.encode(value));
};

export const getItem = (key) => {
	return localStorage.getItem(Base64.encode(key))
		? Base64.decode(localStorage.getItem(Base64.encode(key)))
		: null;
};

export const removeItem = (key) => {
	localStorage.removeItem(Base64.encode(key));
};
