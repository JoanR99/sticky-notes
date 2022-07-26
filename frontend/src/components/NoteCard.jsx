import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import NoteModal from './NoteModal';
import useShowModal from '../hooks/useShowModal';
import ShowDeleteModalButton from './ShowDeleteModalButton';
import ShowArchiveModalButton from './ShowArchiveModalButton';
import ShowEditModalButton from './ShowEditModalButton';

const NoteCard = ({ note }) => {
	const updatedAt = new Date(note.updatedAt);
	const lastEdit = `Last edit: ${updatedAt.toLocaleDateString()} - ${updatedAt.toLocaleTimeString()}`;
	const { show, handleClose, handleShow } = useShowModal();

	return (
		<>
			<NoteModal
				show={show}
				handleClose={handleClose}
				note={note}
				lastEdit={lastEdit}
			/>
			<Card variant="outlined">
				<CardContent onClick={() => handleShow()}>
					<Typography variant="h5" component="div">
						{note.title}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						{lastEdit}
					</Typography>
				</CardContent>

				<CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
					<ShowEditModalButton note={note} />
					<ShowArchiveModalButton note={note} />
					<ShowDeleteModalButton note={note} />
				</CardActions>
			</Card>
		</>
	);
};

export default NoteCard;
