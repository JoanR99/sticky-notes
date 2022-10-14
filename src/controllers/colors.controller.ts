import { RequestHandler } from 'express';
import NotFound from '../errors/NotFound';

import * as colorService from '../services/color.services';

export const getColors: RequestHandler = async (_req, res) => {
	const colors = await colorService.findAll();

	res.json(colors);
};

export const createColor: RequestHandler = async (req, res) => {
	const { name, hex } = req.body;
	const color = await colorService.createColor(name, hex);

	res.status(201).json(color);
};

export const deleteColor: RequestHandler = async (req, res) => {
	const { id } = req.params;

	const color = await colorService.findById(Number(id));

	if (!color) throw new NotFound(req.t('color.not_found'));

	await colorService.deleteColor(Number(id));

	res.json({ message: req.t('color.delete') });
};
