import { useState } from 'react';

const useToggle = (key) => {
	const [value, setValue] = useState(false);

	const toggle = (value) => {
		console.log(value);
		setValue((prev) => {
			return typeof value === 'boolean' ? value : !prev;
		});
		localStorage.setItem(key, JSON.stringify(value));
	};

	return [value, toggle];
};

export default useToggle;
