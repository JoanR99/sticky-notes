import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';
import { CreateNoteInput, GetNotesQuery } from '../modules/note/note.schema';

type RequestOptions = {
	auth?: string;
	query?: GetNotesQuery;
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

const getNotes = (options: RequestOptions = {}) => {
	const agent = request(app)
		.get('/api/notes')
		.query({ ...options.query });

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
	}

	return agent.send();
};

const updateIsArchive = async (id: number, isArchive: boolean = true) => {
	const note = await prisma.note.findUnique({ where: { id } });

	if (note) {
		await prisma.note.update({ where: { id }, data: { isArchive } });
	}
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

describe('Get Notes', () => {
	describe('Failing cases', () => {
		it('should return status 401 on get note request without accessToken', async () => {
			const response = await getNotes();

			expect(response.status).toBe(401);
		});

		it('should return status 401 on get note request with invalid accessToken', async () => {
			const response = await getNotes({
				auth: 'invalid-token',
			});

			expect(response.status).toBe(401);
		});

		it('should return status 404 on get note request with invalid user', async () => {
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

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return message User not found on get note request with invalid user', async () => {
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

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe(en.user.not_found);
		});
	});

	describe('Success cases', () => {
		it('should return status 200 on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.status).toBe(200);
		});

		it('should return array of notes on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.body.length).toBe(1);
		});

		it('should return only array of unarchive notes on get note request success when there is no query string', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.body[0].isArchive).toBe(false);
		});

		it('should return only array of unarchive notes on get note request success when isArchive query is set to false', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await getNotes({
				auth: accessToken,
				query: { isArchive: 'false' },
			});

			expect(response.body[0].isArchive).toBe(false);
		});

		it('should return only array of archived notes on get note request success when isArchive query is set to true', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await updateIsArchive(createdNote.body.id);

			const response = await getNotes({
				auth: accessToken,
				query: { isArchive: 'true' },
			});

			expect(response.body[0].isArchive).toBe(true);
		});

		it('should return only array of archived notes on get note request success when isArchive query is set to true', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await updateIsArchive(createdNote.body.id);

			const response = await getNotes({
				auth: accessToken,
				query: { isArchive: 'true' },
			});

			expect(response.body[0].isArchive).toBe(true);
		});

		it('should return only array of notes of given color query on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await createNote(
				{ ...CREATE_NOTE_BODY, color: 'blue' },
				{
					auth: accessToken,
				}
			);

			const response = await getNotes({
				auth: accessToken,
				query: { isArchive: 'false', color: 'blue' },
			});

			expect(response.body.length).toBe(1);
			expect(response.body[0].color).toBe('blue');
		});

		it('should return only array of notes of given search query on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await createNote(
				{ ...CREATE_NOTE_BODY, title: 'good' },
				{
					auth: accessToken,
				}
			);

			const response = await getNotes({
				auth: accessToken,
				query: { isArchive: 'false', search: 'good' },
			});

			expect(response.body.length).toBe(1);
			expect(response.body[0].title).toBe('good');
		});

		it('should return only array of notes of given search and color query on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(
				{ ...CREATE_NOTE_BODY, title: 'bye', color: 'blue' },
				{
					auth: accessToken,
				}
			);

			await createNote(
				{ ...CREATE_NOTE_BODY, title: 'bye', color: 'red' },
				{
					auth: accessToken,
				}
			);

			const response = await getNotes({
				auth: accessToken,
				query: { isArchive: 'false', search: 'bye', color: 'blue' },
			});

			expect(response.body.length).toBe(1);
			expect(response.body[0].title).toBe('bye');
			expect(response.body[0].color).toBe('blue');
		});
	});

	describe('Internationalization', () => {
		it('should return message User not found on get note request with invalid user', async () => {
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

			const response = await getNotes({
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.user.not_found);
		});
	});
});
