import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

export const FilterProvider = ({ children }) => {
	const [color, setColor] = useState('all');
	const [filter, setFilter] = useState('');

	return (
		<FilterContext.Provider value={{ color, setColor, filter, setFilter }}>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilter = () => useContext(FilterContext);
