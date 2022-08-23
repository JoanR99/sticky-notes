import Button from '@mui/material/Button';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import useShowModal from '../hooks/useShowModal';
import ArchiveNoteModal from './ArchiveNoteModal';
import { Note } from '../types/Note';

const ArchiveNote = ({ note }: { note: Note }) => {
	const { show, handleClose, handleShow } = useShowModal();

	return (
		<>
			{show && (
				<ArchiveNoteModal show={show} handleClose={handleClose} note={note} />
			)}
			{!show && (
				<Button onClick={handleShow}>
					{note?.isArchive ? (
						<UnarchiveIcon sx={{ color: 'black' }} />
					) : (
						<ArchiveIcon sx={{ color: 'black' }} />
					)}
				</Button>
			)}
		</>
	);
};

export default ArchiveNote;
