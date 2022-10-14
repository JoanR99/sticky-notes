import { Response } from 'express';

import * as userService from '../services/user.services';
import * as notesService from '../services/notes.services';
import * as colorService from '../services/color.services';
import NotFound from '../errors/NotFound';
import { CustomRequest } from '../middlewares/verifyJWT';
import BadRequest from '../errors/BadRequest';

export const getNotes = async (req: CustomRequest, res: Response) => {
	const id = req.user;
	const { isArchive } = req.query;

	const booleanIsArchive: boolean = isArchive == 'false' ? false : true;

	if (typeof isArchive === 'undefined') {
		throw new BadRequest([req.t('isArchive')]);
	}

	const user = await userService.findUserById(Number(id));

	if (!user) {
		throw new NotFound(req.t('user.not_found'));
	}

	const notes = await notesService.findByUserIdAndIsArchive(
		user.id,
		booleanIsArchive
	);

	res.status(200).json(notes);
};

export const createNote = async (req: CustomRequest, res: Response) => {
	const id = req.user;
	const { title, content, colorId } = req.body;

	const user = await userService.findUserById(Number(id));

	if (!user) {
		throw new NotFound(req.t('user.not_found'));
	}

	const color = await colorService.findById(colorId);

	if (!color) {
		throw new NotFound(req.t('color.not_found'));
	}

	const note = await notesService.createNote(title, content, color.id, user.id);

	res.status(201).json(note);
};

export const getNote = async (req: CustomRequest, res: Response) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await notesService.findByIdAndUserId(Number(id), Number(userId));

	if (note) {
		return res.status(200).json(note);
	} else {
		return res.status(400).json({ errorMessage: req.t('note.not_found') });
	}
};

export const deleteNote = async (req: CustomRequest, res: Response) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await notesService.findByIdAndUserId(Number(id), Number(userId));

	if (!note) throw new NotFound(req.t('note.not_found'));

	await notesService.deleteNote(Number(id));

	return res.status(200).json({ message: req.t('note.delete') });
};

export const updateNote = async (req: CustomRequest, res: Response) => {
	const userId = req.user;
	const { id } = req.params;
	const { title, content, colorId, isArchive } = req.body;

	const note = await notesService.findByIdAndUserId(Number(id), Number(userId));

	if (!note) {
		throw new NotFound(req.t('note.not_found'));
	}

	if (typeof isArchive === 'undefined') {
		if (note.colorId !== colorId) {
			const newColor = await colorService.findById(colorId);

			if (!newColor) {
				throw new NotFound(req.t('color.not_found'));
			}

			await notesService.connectColor(note.id, newColor.id);
		}

		await notesService.updateNote(note.id, title, content);
	} else {
		await notesService.updateIsArchive(note.id, Boolean(isArchive));
	}

	return res.status(200).json({ message: req.t('note.update') });
};
