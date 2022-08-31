import { useTranslation } from 'react-i18next';

import useGetNotes from '../hooks/useGetNotes';
import NoteList from '../components/NoteList';
import FullScreenLoader from '../components/FullScreenLoader';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';
import { useFilter } from '../context/FilterProvider';

const NotesGrid = () => {
	const { i18n } = useTranslation();
	const { accessToken, changeAccessToken } = useAuth();
	const { colorFilter, searchFilter } = useFilter();
	const privateRequest = usePrivateRequest(
		accessToken,
		changeAccessToken,
		i18n.language
	);
	const { isLoading, data: notes } = useGetNotes(
		privateRequest,
		colorFilter,
		searchFilter,
		i18n.language
	);

	return (
		<>
			{isLoading && <FullScreenLoader />}
			{notes && notes?.length > 0 && <NoteList notes={notes} />}
			{!notes?.length && <h2>There are currently no notes</h2>}
		</>
	);
};

export default NotesGrid;
