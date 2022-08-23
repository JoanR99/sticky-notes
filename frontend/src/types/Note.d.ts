export interface Color {
	name: string;
	hex: string;
	id: number;
}

export interface Note {
	id: number;
	title: string;
	content: string;
	isArchive: boolean;
	updatedAt: string;
	color: Color;
}

interface NoteOptional extends Partial<Note> {
	colorId?: number;
}

export interface UpdateNote {
	id: number;
	newNote: Pick<NoteOptional, 'title' | 'content' | 'isArchive' | 'colorId'>;
}

export interface AddNote extends Pick<Note, 'title' | 'content'> {
	colorId: number;
}
