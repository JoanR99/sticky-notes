import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

export const FilterProvider = ({ children }) => {
	const [color, setColor] = useState('all');

	return (
		<FilterContext.Provider value={{ color, setColor }}>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilter = () => useContext(FilterContext);
