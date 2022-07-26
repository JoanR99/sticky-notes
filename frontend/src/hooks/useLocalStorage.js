import { useState, useEffect } from 'react';


const useLocalStorage = (key, initValue) => {
	const [value, setValue] = useState(() => {
		return getLocalValue(key, initValue);
	});

	useEffect(() => {
		console.log(value);
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};

export default useLocalStorage;
