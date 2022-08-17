import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../app';
import sequelize from '../config/database';
import User from '../models/user';
import Note from '../models/note';
import Color from '../models/color';

type RequestOptions = {
	auth?: string;
	language?: string;
};

type BodyCreateUser = {
	username?: string;
	email?: string;
	password?: string;
};

type BodyCreateNote = {
	title?: string;
	content?: string;
	color?: number;
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
	color: 1,
};

describe('Create Note', () => {
	describe('Failing cases', () => {
		it('should return status 401 on create note request without accessToken', async () => {
			const response = await createNote();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on create note request with invalid accessToken', async () => {
			const response = await createNote(
				{},
				{
					auth: 'invalid-access-token',
				}
			);

			expect(response.status).toBe(403);
		});

		it('should return status 400 on create note request without body', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createNote({}, { auth: accessToken });

			expect(response.status).toBe(400);
		});

		it.each`
			field        | value
			${'title'}   | ${undefined}
			${'content'} | ${undefined}
			${'color'}   | ${undefined}
			${'title'}   | ${1}
			${'content'} | ${1}
			${'color'}   | ${'hello'}
			${'title'}   | ${null}
			${'content'} | ${null}
			${'color'}   | ${null}
			${'title'}   | ${false}
			${'content'} | ${false}
			${'color'}   | ${false}
			${'title'}   | ${{ hi: 'bye' }}
			${'content'} | ${{ hi: 'bye' }}
			${'color'}   | ${{ hi: 'bye' }}
			${'title'}   | ${['hi']}
			${'content'} | ${['hi']}
			${'color'}   | ${['hi']}
		`(
			'should return status 400 on create note request when $field field is $value',
			async ({ field, value }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body: BodyCreateNote = { ...CREATE_NOTE_BODY, [field]: value };

				const response = await createNote(body, { auth: accessToken });

				expect(response.status).toBe(400);
			}
		);

		it('should return error messages on create note request without body', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createNote({}, { auth: accessToken });

			expect(response.body.errorMessage).toEqual([
				'Title is required',
				'Content is required',
				'Color is required',
			]);
		});

		it.each`
			field        | value            | message
			${'title'}   | ${undefined}     | ${'Title is required'}
			${'content'} | ${undefined}     | ${'Content is required'}
			${'color'}   | ${undefined}     | ${'Color is required'}
			${'title'}   | ${1}             | ${'Title must be a string'}
			${'content'} | ${1}             | ${'Content must be a string'}
			${'color'}   | ${'hello'}       | ${'Color must be a number'}
			${'title'}   | ${null}          | ${'Title must be a string'}
			${'content'} | ${null}          | ${'Content must be a string'}
			${'color'}   | ${null}          | ${'Color must be a number'}
			${'title'}   | ${false}         | ${'Title must be a string'}
			${'content'} | ${false}         | ${'Content must be a string'}
			${'color'}   | ${false}         | ${'Color must be a number'}
			${'title'}   | ${{ hi: 'bye' }} | ${'Title must be a string'}
			${'content'} | ${{ hi: 'bye' }} | ${'Content must be a string'}
			${'color'}   | ${{ hi: 'bye' }} | ${'Color must be a number'}
			${'title'}   | ${['hi']}        | ${'Title must be a string'}
			${'content'} | ${['hi']}        | ${'Content must be a string'}
			${'color'}   | ${['hi']}        | ${'Color must be a number'}
		`(
			'should return $message on create note request when $field is $value',
			async ({ field, value, message }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body: BodyCreateNote = { ...CREATE_NOTE_BODY, [field]: value };

				const response = await createNote(body, { auth: accessToken });

				expect(response.body.errorMessage).toEqual([message]);
			}
		);

		it('should return status 404 on create note request from unknown user', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await User.destroy({ where: { email: VALID_CREDENTIALS.email } });

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return status 404 on create note request from unknown user', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await User.destroy({ where: { email: VALID_CREDENTIALS.email } });

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe('User not found');
		});

		it('should return status 404 on create note request with unknown color', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return status 404 on create note request with unknown color', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe('Color not found');
		});
	});

	describe('Success cases', () => {
		it('should return status 201 on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const response = await createNote(
				{ ...CREATE_NOTE_BODY, color: color.id },
				{
					auth: accessToken,
				}
			);

			expect(response.status).toBe(201);
		});

		it('should return note data on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const response = await createNote(
				{ ...CREATE_NOTE_BODY, color: color.id },
				{
					auth: accessToken,
				}
			);

			expect(Object.keys(response.body)).toEqual([
				'id',
				'title',
				'content',
				'isArchive',
				'userId',
				'updatedAt',
				'createdAt',
				'colorId',
			]);
		});

		it('should save note in database on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const createdNote = await createNote(
				{ ...CREATE_NOTE_BODY, color: color.id },
				{
					auth: accessToken,
				}
			);

			const noteInDb = await Note.findOne({
				where: { id: createdNote.body.id },
			});

			expect(noteInDb).not.toBeUndefined();
		});

		it('should save note in database with his corresponding userId on create note request success', async () => {
			const user = await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const createdNote = await createNote(
				{ ...CREATE_NOTE_BODY, color: color.id },
				{
					auth: accessToken,
				}
			);

			const noteInDb = await Note.findOne({
				where: { id: createdNote.body.id },
			});

			expect(user.id).toBe(noteInDb?.userId);
		});

		it('should save note in database with his corresponding colorId on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const createdNote = await createNote(
				{ ...CREATE_NOTE_BODY, color: color.id },
				{
					auth: accessToken,
				}
			);

			const noteInDb = await Note.findOne({
				where: { id: createdNote.body.id },
			});

			expect(color.id).toBe(noteInDb?.colorId);
		});
	});
});
