import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

const FilterProvider = ({ children }) => {
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

const useFilter = () => useContext(FilterContext);

export { FilterProvider, useFilter };
