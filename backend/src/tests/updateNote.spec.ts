import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../app';
import sequelize from '../config/database';
import User from '../models/user';
import Color from '../models/color';
import Note from '../models/note';

type RequestOptions = {
	auth?: string;
	isArchive?: boolean;
};

type BodyCreateUser = {
	username?: string;
	email?: string;
	password?: string;
};

type BodyCreateNote = {
	title?: string;
	content?: string;
	colorId?: number;
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createNote = (
	body: BodyCreateNote = {},
	options: RequestOptions = {}
) => {
	const agent = request(app).post('/api/notes');

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	return agent.send(body);
};

const createUser = async (
	body: BodyCreateUser = {
		username: 'user',
		email: 'user@testing.com',
		password: 'P4ssw0rd',
	}
) => {
	if (typeof body.password === 'string') {
		const hash = await bcrypt.hash(body.password, 10);
		body.password = hash;
	}

	return User.create(body);
};

const createColor = (body = { name: 'white', hex: '#fffffff' }) =>
	Color.create(body);

const updateNotes = (
	id: number = 1,
	body = {},
	options: RequestOptions = {}
) => {
	const agent = request(app).patch(`/api/notes/${id}`);

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	return agent.send(body);
};

beforeAll(async () => {
	await sequelize.sync();
});

beforeEach(async () => {
	await User.destroy({ truncate: true, cascade: true });
	await Color.destroy({ truncate: true, cascade: true });
});

afterAll(async () => {
	await sequelize.close();
});

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

const CREATE_NOTE_BODY = {
	title: 'hello',
	content: 'bye',
	colorId: 1,
};

describe('Update Note', () => {
	describe('Failing cases', () => {
		it('should return status 401 on update note request without accessToken', async () => {
			const response = await updateNotes();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on update note request with invalid accessToken', async () => {
			const response = await updateNotes(
				1,
				{},
				{
					auth: 'invalid-token',
				}
			);

			expect(response.status).toBe(403);
		});

		it('should return status 404 on update note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET as string;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await updateNotes(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(404);
		});

		it('should return message Note not found on update note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET as string;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await updateNotes(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.body.errorMessage).toBe('Note not found');
		});

		it('should return status 404 on update note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await updateNotes(
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

			const response = await updateNotes(
				1,
				{},
				{
					auth: accessToken,
				}
			);

			expect(response.body.errorMessage).toBe('Note not found');
		});

		it('should return status 404 on update note request with invalid color', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const createdNote = await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const response = await updateNotes(
				createdNote.body.id,
				{ title: 'hello', content: 'bye', colorId: 9 },
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

			const color = await createColor();

			const createdNote = await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const response = await updateNotes(
				createdNote.body.id,
				{ title: 'hello', content: 'bye', colorId: 9 },
				{
					auth: accessToken,
				}
			);

			expect(response.body.errorMessage).toBe('Color not found');
		});
	});

	describe('Success Cases', () => {
		it('should return status 200 on update note request success', async () => {
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

			const response = await updateNotes(
				cratedNote.body.id,
				{ title: 'nice', content: 'yes', colorId: color.id },
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(200);
		});

		it('should return message Note updated successfully on update note request success', async () => {
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

			const response = await updateNotes(
				cratedNote.body.id,
				{ title: 'nice', content: 'yes', colorId: color.id },
				{
					auth: accessToken,
				}
			);

			expect(response.body.message).toBe('Note updated successfully');
		});

		it('should update note on update note request success', async () => {
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

			const newColor = await createColor({ name: 'black', hex: '#000000' });

			await updateNotes(
				cratedNote.body.id,
				{ title: 'nice', content: 'yes', colorId: newColor.id },
				{
					auth: accessToken,
				}
			);

			const note = await Note.findOne({ where: { id: cratedNote.body.id } });

			expect(note?.title).toBe('nice');
			expect(note?.content).toBe('yes');
			expect(note?.colorId).toBe(newColor.id);
		});

		it('should toggle isArchive on update note request success', async () => {
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

			await updateNotes(
				cratedNote.body.id,
				{ isArchive: true },
				{
					auth: accessToken,
				}
			);

			const note = await Note.findOne({ where: { id: cratedNote.body.id } });

			expect(note?.isArchive).toBe(true);
		});
	});
});
