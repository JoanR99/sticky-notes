import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';

type RequestOptions = {
	auth?: string;
	isArchive?: boolean;
	language?: string;
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createNote = (body = {}, options: RequestOptions = {}) => {
	const agent = request(app).post('/api/notes');

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	return agent.send(body);
};

const createUser = async (
	body = {
		username: 'user',
		email: 'user@testing.com',
		password: 'P4ssw0rd',
	}
) => {
	if (typeof body.password === 'string') {
		const hash = await bcrypt.hash(body.password, 10);
		body.password = hash;
	}

	return prisma.user.create({ data: body });
};

const createColor = (body = { name: 'white', hex: '#fffffff' }) =>
	prisma.color.create({ data: body });

const deleteNote = (id: number = 1, options: RequestOptions = {}) => {
	const agent = request(app).delete(`/api/notes/${id}`);

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
	}

	return agent.send();
};

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

const CREATE_NOTE_BODY = {
	title: 'hello',
	content: 'bye',
	colorId: 1,
};

describe('Delete Note', () => {
	describe('Failing cases', () => {
		it('should return status 401 on delete note request without accessToken', async () => {
			const response = await deleteNote();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on delete note request with invalid accessToken', async () => {
			const response = await deleteNote(1, {
				auth: 'invalid-token',
			});

			expect(response.status).toBe(403);
		});

		it('should return status 404 on delete note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET!;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return message Note not found on delete note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET!;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe(en.note.not_found);
		});

		it('should return status 404 on delete note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return message Note not found on delete note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe(en.note.not_found);
		});
	});

	describe('Success Cases', () => {
		it('should return status 200 on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const cratedNote = await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const response = await deleteNote(cratedNote.body.id, {
				auth: accessToken,
			});

			expect(response.status).toBe(200);
		});

		it('should return message Note deleted successfully on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const cratedNote = await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const response = await deleteNote(cratedNote.body.id, {
				auth: accessToken,
			});

			expect(response.body.message).toBe(en.note.delete);
		});

		it('should delete note on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const cratedNote = await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			await deleteNote(cratedNote.body.id, {
				auth: accessToken,
			});

			const note = await prisma.note.findUnique({
				where: { id: cratedNote.body.id },
			});

			expect(note).toBeNull();
		});
	});

	describe('Internationalization', () => {
		it('should return message Note not found on delete note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET!;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await deleteNote(1, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.note.not_found);
		});

		it('should return message Note not found on delete note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.note.not_found);
		});

		it('should return message Note deleted successfully on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const cratedNote = await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const response = await deleteNote(cratedNote.body.id, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.message).toBe(es.note.delete);
		});
	});
});
