import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';
import { CreateNoteInput } from '../modules/note/note.schema';

type RequestOptions = {
	auth?: string;
	isArchive?: boolean;
	language?: string;
};

const login = (credentials = {}) =>
	request(app).post('/api/users/login').send(credentials);

const createNote = (
	body: Partial<CreateNoteInput> = {},
	options: RequestOptions = {}
) => {
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

const updateNote = (
	id: number = 1,
	body = {},
	options: RequestOptions = {}
) => {
	const agent = request(app).patch(`/api/notes/${id}`);

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
	}

	return agent.send(body);
};

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

const CREATE_NOTE_BODY: CreateNoteInput = {
	title: 'hello',
	content: 'bye',
	color: 'white',
};

describe('Update Note', () => {
	describe('Failing cases', () => {
		it('should return status 401 on update note request without accessToken', async () => {
			const response = await updateNote();

			expect(response.status).toBe(401);
		});

		it('should return status 401 on update note request with invalid accessToken', async () => {
			const response = await updateNote(
				1,
				{},
				{
					auth: 'invalid-token',
				}
			);

			expect(response.status).toBe(401);
		});

		it('should return status 404 on update note request with invalid user', async () => {
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

			const response = await updateNote(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(404);
		});

		it('should return message Note not found on update note request with invalid user', async () => {
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

			const response = await updateNote(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.body.errorMessage).toBe(en.user.not_found);
		});

		it('should return status 404 on update note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await updateNote(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(404);
		});

		it('should return message Note not found on update note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await updateNote(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.body.errorMessage).toBe(en.note.not_found);
		});

		it('should return status 400 on update note request with invalid color', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await updateNote(
				createdNote.body.id,
				{ title: 'hello', content: 'bye', color: 'orang' },
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(400);
		});

		it('should return 403 when user is not author of the note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await createUser({
				...VALID_CREDENTIALS,
				username: 'user2',
				email: 'user2@example.com',
			});

			const secondLoginResponse = await login({
				...VALID_CREDENTIALS,
				email: 'user2@example.com',
			});

			const secondAccessToken = secondLoginResponse.body.accessToken;

			const response = await updateNote(
				1,
				{ title: 'hello', content: 'bye', color: 'orange' },
				{
					auth: secondAccessToken,
				}
			);

			expect(response.status).toBe(403);
		});
	});

	describe('Success Cases', () => {
		it('should return status 200 on update note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await updateNote(
				createdNote.body.id,
				{ title: 'nice', content: 'yes', color: 'gray' },
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(200);
		});

		it('should update note on update note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await updateNote(
				createdNote.body.id,
				{ title: 'nice', content: 'yes', color: 'yellow' },
				{
					auth: accessToken,
				}
			);

			const note = await prisma.note.findUnique({
				where: { id: createdNote.body.id },
			});

			expect(note?.title).toBe('nice');
			expect(note?.content).toBe('yes');
			expect(note?.color).toBe('yellow');
		});

		it('should return updated note data on update note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await updateNote(
				createdNote.body.id,
				{ title: 'nice', content: 'yes', color: 'yellow' },
				{
					auth: accessToken,
				}
			);

			expect(response.body.title).toBe('nice');
			expect(response.body.content).toBe('yes');
			expect(response.body.color).toBe('yellow');
		});

		it('should toggle isArchive on update note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await updateNote(
				createdNote.body.id,
				{ isArchive: true },
				{
					auth: accessToken,
				}
			);

			const note = await prisma.note.findUnique({
				where: { id: createdNote.body.id },
			});

			expect(note?.isArchive).toBe(true);
		});
	});

	describe('Internationalization', () => {
		it('should return message Note not found on update note request with invalid user', async () => {
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

			const response = await updateNote(
				1,
				{},
				{
					auth: accessToken,
					language: 'es',
				}
			);

			expect(response.body.errorMessage).toBe(es.user.not_found);
		});

		it('should return message Note not found on update note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await updateNote(
				1,
				{},
				{
					auth: accessToken,
					language: 'es',
				}
			);

			expect(response.body.errorMessage).toBe(es.note.not_found);
		});
	});
});
