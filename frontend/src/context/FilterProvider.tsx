import { createContext, useContext, useState } from 'react';

import { ProviderProps } from '../types/ProviderProps';

interface FilterContext {
	colorFilter: string;
	searchFilter: string;
	changeColorFilter: (value: string) => void;
	changeSearchFilter: (value: string) => void;
}

const INITIAL_STATE: FilterContext = {
	colorFilter: 'all',
	searchFilter: '',
	changeColorFilter: () => {},
	changeSearchFilter: () => {},
};

const FilterContext = createContext<FilterContext>(INITIAL_STATE);

export const FilterProvider = ({ children }: ProviderProps) => {
	const [colorFilter, setColorFilter] = useState('all');
	const [searchFilter, setSearchFilter] = useState('');

	const changeColorFilter = (value: string) => setColorFilter(value);
	const changeSearchFilter = (value: string) => setSearchFilter(value);

	return (
		<FilterContext.Provider
			value={{
				colorFilter,
				changeColorFilter,
				searchFilter,
				changeSearchFilter,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilter = () => useContext(FilterContext);
