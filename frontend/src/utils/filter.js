const filterNotes = (notes, colorFilter, searchFilter) => {
	if (colorFilter === 'all' && !searchFilter) return notes;
	if (colorFilter !== 'all' && !searchFilter)
		return notes.filter((note) => note.color.name === colorFilter);
	if (colorFilter === 'all' && searchFilter)
		return notes.filter(
			(note) =>
				note.title.includes(searchFilter) || note.content.includes(searchFilter)
		);
	if (colorFilter !== 'all' && searchFilter)
		return notes.filter(
			(note) =>
				note.color.name === colorFilter &&
				(note.title.includes(searchFilter) ||
					note.content.includes(searchFilter))
		);
};

export default filterNotes;
