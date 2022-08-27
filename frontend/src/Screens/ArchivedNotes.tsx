import Container from '@mui/material/Container';

import useGetArchivedNotes from '../hooks/useGetArchivedNotes';
import NoteList from '../components/NoteList';
import FullScreenLoader from '../components/FullScreenLoader';
import usePrivateRequest from '../hooks/usePrivateRequest';
import { useAuth } from '../context/AuthProvider';
import { useFilter } from '../context/FilterProvider';

const ArchivedNotes = () => {
	const { accessToken, changeAccessToken } = useAuth();
	const privateRequest = usePrivateRequest(accessToken, changeAccessToken);
	const { colorFilter, searchFilter } = useFilter();
	const { isLoading, data: notes } = useGetArchivedNotes(
		privateRequest,
		colorFilter,
		searchFilter
	);

	return (
		<Container>
			{isLoading && <FullScreenLoader />}
			{notes && notes?.length > 0 && <NoteList notes={notes} />}
			{notes?.length === 0 && <h2>There are currently no archived notes</h2>}
		</Container>
	);
};

export default ArchivedNotes;
