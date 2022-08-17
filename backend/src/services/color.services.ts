import Color from '../models/color';

export const findById = async (id: number) =>
	await Color.findOne({ where: { id } });

export const findAll = async () => await Color.findAll({});

export const createColor = async (name: string, hex: string) =>
	await Color.create({ name, hex });

export const deleteColor = async (id: number) =>
	await Color.destroy({ where: { id } });
