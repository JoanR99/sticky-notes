import React from 'react';
// import { Card } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import ShowArchiveModalButton from '../components/ShowArchiveModalButton';
// import ShowEditModalButton from '../components/ShowEditModalButton';
// import ShowDeleteModalButton from '../components/ShowDeleteModalButton';
// import useGetNote from '../hooks/useGetNote';
// import Spinner from '../components/Spinner/Spinner';

const NoteModal = () => {
	// const { id } = useParams();
	// const { note, isLoading, error } = useGetNote(id);
	// const updatedAt = new Date(note?.updatedAt);
	// const lastEdit = `Last edit: ${updatedAt?.toLocaleDateString()} - ${updatedAt?.toLocaleTimeString()}`;
	return (
		<>
			{/* {isLoading && <Spinner />}
			{error && <h2>{error?.response?.message}</h2>}
			{note && (
				<Card>
					<Card.Body>
						<Card.Title>{note.title}</Card.Title>
						<Card.Text>{note.content}</Card.Text>
						<Card.Text>{lastEdit}</Card.Text>
					</Card.Body>
					<Card.Footer className="d-flex justify-content-end">
						<ShowArchiveModalButton note={note} />
						<ShowEditModalButton note={note} />
						<ShowDeleteModalButton note={note} />
					</Card.Footer>
				</Card>
			)} */}
		</>
	);
};

export default NoteModal;
