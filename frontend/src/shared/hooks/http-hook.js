// frontend\src\shared\hooks\http-hook.js
import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequests = useRef([]);

	const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
		setIsLoading(true);

		const httpAbortCtrl = new AbortController();

		activeHttpRequests.current.push(httpAbortCtrl);

		try {
			if (body && method !== 'GET' && method !== 'HEAD') {
				if (body instanceof FormData) {
					delete headers['Content-Type'];
				} else {
					headers['Content-Type'] = 'application/json';
					body = JSON.stringify(body);
				}
			}

			const requestOptions = {
				method,
				body,
				headers,
				signal: httpAbortCtrl.signal,
			};

			const response = await fetch(url, requestOptions);

			let responseData;
			const contentType = response.headers.get('Content-Type');
			if (contentType && contentType.includes('application/json')) {
				responseData = await response.json();
			} else {
				responseData = await response.text();
			}

			activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrl);

			if (!response.ok) {
				throw new Error(responseData.message || responseData);
			}

			setIsLoading(false);

			return responseData;
		} catch (err) {
			setError(err.message);
			setIsLoading(false);

			throw err;
		}
	}, []);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
		};
	}, []);

	return { isLoading, error, sendRequest, clearError };
};
