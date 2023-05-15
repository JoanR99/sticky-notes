import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app';
import { CreateNoteInput } from '../modules/note/note.schema';
import { prisma } from '../../prisma';

export const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

export const CREATE_NOTE_BODY: CreateNoteInput = {
	title: 'hello',
	content: 'bye',
	color: 'white',
};

export const login = (credentials = {}) =>
	request(app).post('/api/users/login').send(credentials);

export const createUser = async (
	body = {
		username: 'user',
		...VALID_CREDENTIALS,
	}
) => {
	if (typeof body.password === 'string') {
		const hash = await bcrypt.hash(body.password, 10);
		body.password = hash;
	}

	return prisma.user.create({ data: body });
};

type RequestOptions = {
	auth?: string;
};

export const createNote = (
	body: Partial<CreateNoteInput> = {},
	options: RequestOptions = {}
) => {
	const agent = request(app).post('/api/notes');

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	return agent.send(body);
};
