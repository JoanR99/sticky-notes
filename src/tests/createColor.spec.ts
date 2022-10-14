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

const createColor = (body = {}, options: RequestOptions = {}) => {
	const agent = request(app).post('/api/colors');

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

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

const CREATE_COLOR_BODY = {
	name: 'white',
	hex: '#ffffff',
};

describe('Create Color', () => {
	describe('Failing cases', () => {
		it('should return status 401 on create color request without accessToken', async () => {
			const response = await createColor();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on create note request with invalid accessToken', async () => {
			const response = await createColor(
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

			const response = await createColor({}, { auth: accessToken });

			expect(response.status).toBe(400);
		});

		it.each`
			field     | value
			${'name'} | ${undefined}
			${'hex'}  | ${undefined}
			${'name'} | ${1}
			${'hex'}  | ${1}
			${'name'} | ${null}
			${'hex'}  | ${null}
			${'name'} | ${false}
			${'hex'}  | ${false}
			${'name'} | ${{ hi: 'bye' }}
			${'hex'}  | ${{ hi: 'bye' }}
			${'name'} | ${['hi']}
			${'hex'}  | ${['hi']}
		`(
			'should return status 400 on create note request when $field field is $value',
			async ({ field, value }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body = { ...CREATE_COLOR_BODY, [field]: value };

				const response = await createColor(body, { auth: accessToken });

				expect(response.status).toBe(400);
			}
		);

		it('should return error messages on create note request without body', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createColor({}, { auth: accessToken });

			expect(response.body.errorMessage).toEqual([
				en.validation.name.required,
				en.validation.hex.required,
			]);
		});

		it.each`
			field     | value            | message
			${'name'} | ${undefined}     | ${en.validation.name.required}
			${'hex'}  | ${undefined}     | ${en.validation.hex.required}
			${'name'} | ${1}             | ${en.validation.name.type}
			${'hex'}  | ${1}             | ${en.validation.hex.type}
			${'name'} | ${null}          | ${en.validation.name.type}
			${'hex'}  | ${null}          | ${en.validation.hex.type}
			${'name'} | ${false}         | ${en.validation.name.type}
			${'hex'}  | ${false}         | ${en.validation.hex.type}
			${'name'} | ${{ hi: 'bye' }} | ${en.validation.name.type}
			${'hex'}  | ${{ hi: 'bye' }} | ${en.validation.hex.type}
			${'name'} | ${['hi']}        | ${en.validation.name.type}
			${'hex'}  | ${['hi']}        | ${en.validation.hex.type}
		`(
			'should return $message on create note request when $field is $value',
			async ({ field, value, message }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body = { ...CREATE_COLOR_BODY, [field]: value };

				const response = await createColor(body, { auth: accessToken });

				expect(response.body.errorMessage).toEqual([message]);
			}
		);
	});

	describe('Success cases', () => {
		it('should return status 201 on create color request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createColor(CREATE_COLOR_BODY, {
				auth: accessToken,
			});

			expect(response.status).toBe(201);
		});

		it('should return note data on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createColor(CREATE_COLOR_BODY, {
				auth: accessToken,
			});

			expect(Object.keys(response.body)).toEqual([
				'id',
				'createdAt',
				'updatedAt',
				'name',
				'hex',
			]);
		});

		it('should save note in database on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdColor = await createColor(CREATE_COLOR_BODY, {
				auth: accessToken,
			});

			const colorInDb = await prisma.color.findUnique({
				where: { id: createdColor.body.id },
			});

			expect(colorInDb).not.toBeUndefined();
		});
	});

	describe('Internationalization', () => {
		it('should return error messages on create note request without body', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await createColor(
				{},
				{ auth: accessToken, language: 'es' }
			);

			expect(response.body.errorMessage).toEqual([
				es.validation.name.required,
				es.validation.hex.required,
			]);
		});

		it.each`
			field     | value            | message
			${'name'} | ${undefined}     | ${es.validation.name.required}
			${'hex'}  | ${undefined}     | ${es.validation.hex.required}
			${'name'} | ${1}             | ${es.validation.name.type}
			${'hex'}  | ${1}             | ${es.validation.hex.type}
			${'name'} | ${null}          | ${es.validation.name.type}
			${'hex'}  | ${null}          | ${es.validation.hex.type}
			${'name'} | ${false}         | ${es.validation.name.type}
			${'hex'}  | ${false}         | ${es.validation.hex.type}
			${'name'} | ${{ hi: 'bye' }} | ${es.validation.name.type}
			${'hex'}  | ${{ hi: 'bye' }} | ${es.validation.hex.type}
			${'name'} | ${['hi']}        | ${es.validation.name.type}
			${'hex'}  | ${['hi']}        | ${es.validation.hex.type}
		`(
			'should return $message on create note request when $field is $value',
			async ({ field, value, message }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body = { ...CREATE_COLOR_BODY, [field]: value };

				const response = await createColor(body, {
					auth: accessToken,
					language: 'es',
				});

				expect(response.body.errorMessage).toEqual([message]);
			}
		);
	});
});
