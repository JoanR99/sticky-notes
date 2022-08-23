import { Note } from '../types/Note';

const filterNotes = (
	notes: Note[],
	colorFilter: string,
	searchFilter: string
) => {
	if (colorFilter === 'all' && !searchFilter) return notes;
	if (colorFilter !== 'all' && !searchFilter)
		return notes.filter((note) => note.color?.name === colorFilter);
	if (colorFilter === 'all' && searchFilter)
		return notes.filter(
			(note) =>
				note.title.includes(searchFilter) || note.content.includes(searchFilter)
		);
	if (colorFilter !== 'all' && searchFilter)
		return notes.filter(
			(note) =>
				note.color?.name === colorFilter &&
				(note.title.includes(searchFilter) ||
					note.content.includes(searchFilter))
		);

	return notes;
};

export default filterNotes;
