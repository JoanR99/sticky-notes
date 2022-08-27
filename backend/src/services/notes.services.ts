import { prisma } from '../../prisma';

export const findByIdAndUserId = async (id: number, userId: number) =>
	await prisma.note.findFirst({
		where: { id, authorId: userId },
		include: { color: true },
	});

export const deleteNote = async (id: number) =>
	await prisma.note.delete({ where: { id } });

export const findByUserIdAndIsArchive = async (
	userId: number,
	isArchive: boolean
) =>
	await prisma.note.findMany({
		where: { authorId: userId, isArchive },
		orderBy: { updatedAt: 'desc' },
		include: { color: true },
	});

export const createNote = async (
	title: string,
	content: string,
	colorId: number,
	userId: number
) =>
	await prisma.note.create({
		data: {
			title,
			content,
			color: {
				connect: { id: colorId },
			},
			author: {
				connect: { id: userId },
			},
		},
		include: { color: true },
	});

export const connectColor = async (noteId: number, colorId: number) => {
	await prisma.note.update({
		where: { id: noteId },
		data: {
			color: {
				connect: { id: colorId },
			},
		},
	});
};

export const updateNote = async (
	noteId: number,
	title: string,
	content: string
) =>
	await prisma.note.update({
		where: { id: noteId },
		data: { title, content },
	});

export const updateIsArchive = async (noteId: number, isArchive: boolean) =>
	await prisma.note.update({
		where: { id: noteId },
		data: { isArchive },
	});
