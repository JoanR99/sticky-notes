import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useShowModal from '../hooks/useShowModal';
import AddNoteModal from './AddNoteModal';

const AddNote = () => {
	const { show, handleClose, handleShow } = useShowModal();

	console.log('add');

	return show ? (
		<AddNoteModal show={show} handleClose={handleClose} />
	) : (
		<Box sx={{ '& > :not(style)': { m: 1 } }}>
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: 'fixed',
					bottom: (theme) => theme.spacing(2),
					right: (theme) => theme.spacing(4),
				}}
				onClick={handleShow}
			>
				<AddIcon />
			</Fab>
		</Box>
	);
};

export default AddNote;
