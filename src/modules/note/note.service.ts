import { prisma } from '../../../prisma';
import { CreateNoteInput, GetNotesQuery, UpdateNoteInput } from './note.schema';

export async function createNote(noteBody: CreateNoteInput, userId: number) {
	const note = await prisma.note.create({
		data: {
			...noteBody,
			authorId: userId,
		},
	});

	return note;
}

export async function getNotes(userId: number, query: GetNotesQuery) {
	const { color, search } = query;

	const isArchive = (query.isArchive as string) == 'true' ? true : false;

	try {
		const notes = await prisma.note.findMany({
			where: {
				authorId: userId,
				isArchive,
				color,
				AND: [
					{
						OR: [
							{
								title: {
									contains: search,
									mode: 'insensitive',
								},
							},
							{
								content: {
									contains: search,
									mode: 'insensitive',
								},
							},
						],
					},
				],
			},
			orderBy: {
				updatedAt: 'desc',
			},
		});

		return notes;
	} catch (e) {
		console.log(e);
		throw new Error('error');
	}
}

export async function updateNote(noteId: number, noteBody: UpdateNoteInput) {
	const note = await prisma.note.update({
		where: {
			id: noteId,
		},
		data: {
			...noteBody,
		},
	});

	return note;
}

export async function deleteNote(noteId: number) {
	const note = await prisma.note.delete({
		where: {
			id: noteId,
		},
	});

	return note;
}

export async function findById(noteId: number) {
	const note = await prisma.note.findUnique({
		where: {
			id: noteId,
		},
	});

	return note;
}
