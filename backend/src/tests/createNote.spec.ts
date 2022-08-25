import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../app';
import { prisma } from '../../prisma';

type RequestOptions = {
	auth?: string;
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

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

const CREATE_NOTE_BODY = {
	title: 'hello',
	content: 'bye',
	colorId: 1,
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
			${'colorId'} | ${undefined}
			${'title'}   | ${1}
			${'content'} | ${1}
			${'colorId'} | ${'hello'}
			${'title'}   | ${null}
			${'content'} | ${null}
			${'colorId'} | ${null}
			${'title'}   | ${false}
			${'content'} | ${false}
			${'colorId'} | ${false}
			${'title'}   | ${{ hi: 'bye' }}
			${'content'} | ${{ hi: 'bye' }}
			${'colorId'} | ${{ hi: 'bye' }}
			${'title'}   | ${['hi']}
			${'content'} | ${['hi']}
			${'colorId'} | ${['hi']}
		`(
			'should return status 400 on create note request when $field field is $value',
			async ({ field, value }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body = { ...CREATE_NOTE_BODY, [field]: value };

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
			${'colorId'} | ${undefined}     | ${'Color is required'}
			${'title'}   | ${1}             | ${'Title must be a string'}
			${'content'} | ${1}             | ${'Content must be a string'}
			${'colorId'} | ${'hello'}       | ${'Color must be a number'}
			${'title'}   | ${null}          | ${'Title must be a string'}
			${'content'} | ${null}          | ${'Content must be a string'}
			${'colorId'} | ${null}          | ${'Color must be a number'}
			${'title'}   | ${false}         | ${'Title must be a string'}
			${'content'} | ${false}         | ${'Content must be a string'}
			${'colorId'} | ${false}         | ${'Color must be a number'}
			${'title'}   | ${{ hi: 'bye' }} | ${'Title must be a string'}
			${'content'} | ${{ hi: 'bye' }} | ${'Content must be a string'}
			${'colorId'} | ${{ hi: 'bye' }} | ${'Color must be a number'}
			${'title'}   | ${['hi']}        | ${'Title must be a string'}
			${'content'} | ${['hi']}        | ${'Content must be a string'}
			${'colorId'} | ${['hi']}        | ${'Color must be a number'}
		`(
			'should return $message on create note request when $field is $value',
			async ({ field, value, message }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body = { ...CREATE_NOTE_BODY, [field]: value };

				const response = await createNote(body, { auth: accessToken });

				expect(response.body.errorMessage).toEqual([message]);
			}
		);

		it('should return status 404 on create note request from unknown user', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await prisma.user.delete({ where: { email: VALID_CREDENTIALS.email } });

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return error message on create note request from unknown user', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await prisma.user.delete({ where: { email: VALID_CREDENTIALS.email } });

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
				{ ...CREATE_NOTE_BODY, colorId: color.id },
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
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			expect(Object.keys(response.body)).toEqual([
				'id',
				'createdAt',
				'updatedAt',
				'title',
				'content',
				'isArchive',
				'authorId',
				'colorId',
				'color',
			]);
		});

		it('should save note in database on create note request success', async () => {
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

			const noteInDb = await prisma.note.findUnique({
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
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const noteInDb = await prisma.note.findUnique({
				where: { id: createdNote.body.id },
			});

			expect(user.id).toBe(noteInDb?.authorId);
		});

		it('should save note in database with his corresponding colorId on create note request success', async () => {
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

			const noteInDb = await prisma.note.findUnique({
				where: { id: createdNote.body.id },
			});

			expect(color.id).toBe(noteInDb?.colorId);
		});
	});
});
