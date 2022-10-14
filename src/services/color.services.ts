import { prisma } from '../../prisma';

export const findById = async (id: number) =>
	await prisma.color.findUnique({ where: { id } });

export const findAll = async () => await prisma.color.findMany();

export const createColor = async (name: string, hex: string) =>
	await prisma.color.create({ data: { name, hex } });

export const deleteColor = async (id: number) =>
	await prisma.color.delete({ where: { id } });
