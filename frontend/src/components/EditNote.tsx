import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

import useShowModal from '../hooks/useShowModal';
import EditNoteModal from './EditNoteModal';
import { Note } from '../types/Note';

const EditNote = ({ note }: { note: Note }) => {
	const { show, handleClose, handleShow } = useShowModal();

	return (
		<>
			{show && (
				<EditNoteModal show={show} handleClose={handleClose} note={note} />
			)}
			{!show && (
				<Button onClick={handleShow}>
					<EditIcon sx={{ color: 'black' }} />
				</Button>
			)}
		</>
	);
};

export default EditNote;
