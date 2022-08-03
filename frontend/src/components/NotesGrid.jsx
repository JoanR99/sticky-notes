import { toast } from 'react-toastify';
import useGetNotes from '../hooks/useGetNotes';
import NoteList from '../components/NoteList';
import FullScreenLoader from '../components/FullScreenLoader';

const NotesGrid = () => {
	const { isLoading, notes } = useGetNotes({
		onError: (error) => {
			toast.error(error.response.data.message);
		},
	});
	return (
		<>
			{isLoading && <FullScreenLoader />}
			{notes?.length > 0 && <NoteList notes={notes} />}
			{!notes?.length && <h2>There are currently no notes</h2>}
		</>
	);
};

export default NotesGrid;
