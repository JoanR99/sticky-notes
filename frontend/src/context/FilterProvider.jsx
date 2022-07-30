import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

export const FilterProvider = ({ children }) => {
	const [colorFilter, setColorFilter] = useState('all');
	const [searchFilter, setSearchFilter] = useState('');

	return (
		<FilterContext.Provider
			value={{ colorFilter, setColorFilter, searchFilter, setSearchFilter }}
		>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilter = () => useContext(FilterContext);
