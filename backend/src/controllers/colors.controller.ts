import { RequestHandler } from 'express';

import * as colorService from '../services/color.services';

export const getColors: RequestHandler = async (_req, res) => {
	const colors = await colorService.findAll();

	res.json(colors);
};

export const createColor: RequestHandler = async (req, res) => {
	const { name, hex } = req.body;
	const color = await colorService.createColor(name, hex);

	res.json(color);
};

export const deleteColor: RequestHandler = async (req, res) => {
	const { id } = req.params;
	await colorService.deleteColor(Number(id));

	res.json({ message: 'Color deleted successfully' });
};
