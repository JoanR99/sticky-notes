import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import useShowModal from '../hooks/useShowModal';
import DeleteNoteModal from './DeleteNoteModal';

const DeleteNote = ({ id }: { id: number }) => {
	const { show, handleClose, handleShow } = useShowModal();

	return (
		<>
			{show && (
				<DeleteNoteModal show={show} handleClose={handleClose} id={id} />
			)}
			{!show && (
				<Button onClick={handleShow}>
					<DeleteIcon sx={{ color: 'black' }} />
				</Button>
			)}
		</>
	);
};

export default DeleteNote;
