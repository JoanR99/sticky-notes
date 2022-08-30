import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';

type RequestOptions = {
	auth?: string;
	language?: string;
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createNote = (body = {}, options: RequestOptions = {}) => {
	const agent = request(app).post('/api/notes');

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
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
				en.validation.title.required,
				en.validation.content.required,
				en.validation.color_id.required,
			]);
		});

		it.each`
			field        | value            | message
			${'title'}   | ${undefined}     | ${en.validation.title.required}
			${'content'} | ${undefined}     | ${en.validation.content.required}
			${'colorId'} | ${undefined}     | ${en.validation.color_id.required}
			${'title'}   | ${1}             | ${en.validation.title.type}
			${'content'} | ${1}             | ${en.validation.content.type}
			${'colorId'} | ${'hello'}       | ${en.validation.color_id.type}
			${'title'}   | ${null}          | ${en.validation.title.type}
			${'content'} | ${null}          | ${en.validation.content.type}
			${'colorId'} | ${null}          | ${en.validation.color_id.type}
			${'title'}   | ${false}         | ${en.validation.title.type}
			${'content'} | ${false}         | ${en.validation.content.type}
			${'colorId'} | ${false}         | ${en.validation.color_id.type}
			${'title'}   | ${{ hi: 'bye' }} | ${en.validation.title.type}
			${'content'} | ${{ hi: 'bye' }} | ${en.validation.content.type}
			${'colorId'} | ${{ hi: 'bye' }} | ${en.validation.color_id.type}
			${'title'}   | ${['hi']}        | ${en.validation.title.type}
			${'content'} | ${['hi']}        | ${en.validation.content.type}
			${'colorId'} | ${['hi']}        | ${en.validation.color_id.type}
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

			expect(response.body.errorMessage).toBe(en.user.not_found);
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

			expect(response.body.errorMessage).toBe(en.color.not_found);
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

	describe('Internationalization', () => {
		it('should return error messages on create note request without body', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createNote(
				{},
				{ auth: accessToken, language: 'es' }
			);

			expect(response.body.errorMessage).toEqual([
				es.validation.title.required,
				es.validation.content.required,
				es.validation.color_id.required,
			]);
		});

		it.each`
			field        | value            | message
			${'title'}   | ${undefined}     | ${es.validation.title.required}
			${'content'} | ${undefined}     | ${es.validation.content.required}
			${'colorId'} | ${undefined}     | ${es.validation.color_id.required}
			${'title'}   | ${1}             | ${es.validation.title.type}
			${'content'} | ${1}             | ${es.validation.content.type}
			${'colorId'} | ${'hello'}       | ${es.validation.color_id.type}
			${'title'}   | ${null}          | ${es.validation.title.type}
			${'content'} | ${null}          | ${es.validation.content.type}
			${'colorId'} | ${null}          | ${es.validation.color_id.type}
			${'title'}   | ${false}         | ${es.validation.title.type}
			${'content'} | ${false}         | ${es.validation.content.type}
			${'colorId'} | ${false}         | ${es.validation.color_id.type}
			${'title'}   | ${{ hi: 'bye' }} | ${es.validation.title.type}
			${'content'} | ${{ hi: 'bye' }} | ${es.validation.content.type}
			${'colorId'} | ${{ hi: 'bye' }} | ${es.validation.color_id.type}
			${'title'}   | ${['hi']}        | ${es.validation.title.type}
			${'content'} | ${['hi']}        | ${es.validation.content.type}
			${'colorId'} | ${['hi']}        | ${es.validation.color_id.type}
		`(
			'should return $message on create note request when $field is $value',
			async ({ field, value, message }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body = { ...CREATE_NOTE_BODY, [field]: value };

				const response = await createNote(body, {
					auth: accessToken,
					language: 'es',
				});

				expect(response.body.errorMessage).toEqual([message]);
			}
		);

		it('should return error message on create note request from unknown user', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await prisma.user.delete({ where: { email: VALID_CREDENTIALS.email } });

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.user.not_found);
		});

		it('should return status 404 on create note request with unknown color', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.color.not_found);
		});
	});
});
