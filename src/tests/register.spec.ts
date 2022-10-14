import request from 'supertest';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';

type RequestOptions = {
	language?: string;
};

const register = (credentials = {}, options: RequestOptions = {}) => {
	const agent = request(app).post('/api/users/register');

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
	}

	return agent.send(credentials);
};

const VALID_CREDENTIALS = {
	username: 'user',
	email: 'user@testing.com',
	password: 'P@ssw0rd',
};

describe('Register', () => {
	describe('Failing cases', () => {
		it('should return status 400 on register request without credentials', async () => {
			const response = await register();

			expect(response.status).toBe(400);
		});

		it.each`
			field         | failCase
			${'password'} | ${'without password field'}
			${'email'}    | ${'without email field'}
			${'username'} | ${'without username field'}
		`(
			'should return status 400 on register request $failCase',
			async ({ field }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

				const response = await register(credentials);

				expect(response.status).toBe(400);
			}
		);

		it('should return error messages on register request without credentials', async () => {
			const response = await register();

			expect(response.body.errorMessage).toEqual([
				en.validation.username.required,
				en.validation.email.required,
				en.validation.password.required,
			]);
		});

		it.each`
			field         | message                              | failCase
			${'password'} | ${[en.validation.password.required]} | ${'without password field'}
			${'email'}    | ${[en.validation.email.required]}    | ${'without email field'}
			${'username'} | ${[en.validation.username.required]} | ${'without username field'}
		`(
			'should return error message on register request $failCase',
			async ({ field, message }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

				const response = await register(credentials);

				expect(response.body.errorMessage).toEqual(message);
			}
		);

		it('should return status 400 on register request with malformed email', async () => {
			const response = await register({
				...VALID_CREDENTIALS,
				email: 'user@',
			});

			expect(response.status).toBe(400);
		});

		it('should return error message on register request with malformed email', async () => {
			const response = await register({
				...VALID_CREDENTIALS,
				email: 'user@',
			});

			expect(response.body.errorMessage).toEqual([en.validation.email.invalid]);
		});

		it.each`
			password                       | failCase
			${'P@ssw0r'}                   | ${'shorter than 8 characters'}
			${'P@ssw0rdxxxxxxxxxxxxxxxxx'} | ${'with 24 characters or more'}
			${'Passw0rd'}                  | ${'without special character'}
			${'P@SSW0RD'}                  | ${'without lowercase letter'}
			${'p@ssw0rd'}                  | ${'without uppercase letter'}
			${'p@ssword'}                  | ${'without number'}
		`(
			'should return status 400 on register request with password $failCase',
			async ({ password }) => {
				const response = await register({
					...VALID_CREDENTIALS,
					password,
				});

				expect(response.status).toBe(400);
			}
		);

		it.each`
			password                       | message                           | failCase
			${'P@ssw0r'}                   | ${en.validation.password.min}     | ${'shorter than 8 characters'}
			${'P@ssw0rdxxxxxxxxxxxxxxxxx'} | ${en.validation.password.max}     | ${'with 24 characters or more'}
			${'Passw0rd'}                  | ${en.validation.password.invalid} | ${'without special character'}
			${'P@SSW0RD'}                  | ${en.validation.password.invalid} | ${'without lowercase letter'}
			${'p@ssw0rd'}                  | ${en.validation.password.invalid} | ${'without uppercase letter'}
			${'p@ssword'}                  | ${en.validation.password.invalid} | ${'without number'}
		`(
			'should return $message message on register request with password $failCase',
			async ({ password, message }) => {
				const response = await register({
					...VALID_CREDENTIALS,
					password,
				});

				expect(response.body.errorMessage).toEqual([message]);
			}
		);

		it.each`
			username                   | failCase
			${'u'}                     | ${'shorter than 2 characters'}
			${'useruseruseruseruseru'} | ${'with 20 characters or more'}
		`(
			'should return 400 status when username $failCase',
			async ({ username }) => {
				const response = await register({
					...VALID_CREDENTIALS,
					username,
				});

				expect(response.status).toBe(400);
			}
		);

		it.each`
			username                   | message                       | failCase
			${'u'}                     | ${en.validation.username.min} | ${'shorter than 2 characters'}
			${'useruseruseruseruseru'} | ${en.validation.username.max} | ${'with 20 characters or more'}
		`(
			'should return $message message when username $failCase',
			async ({ username, message }) => {
				const response = await register({
					...VALID_CREDENTIALS,
					username,
				});

				expect(response.body.errorMessage).toEqual([message]);
			}
		);
	});

	describe('Success cases', () => {
		it('should return status 201 on valid register request', async () => {
			const response = await register(VALID_CREDENTIALS);

			expect(response.status).toBe(201);
		});

		it('should return success message on valid register request', async () => {
			const response = await register(VALID_CREDENTIALS);

			expect(response.body.message).toBe(en.user.create);
		});

		it('should save user in database on valid register request', async () => {
			await register(VALID_CREDENTIALS);

			const userList = await prisma.user.findMany();

			expect(userList.length).toBe(1);
		});

		it('should save username and email in database on valid register request', async () => {
			await register(VALID_CREDENTIALS);

			const userList = await prisma.user.findMany();

			expect(userList[0].username).toBe(VALID_CREDENTIALS.username);
			expect(userList[0].email).toBe(VALID_CREDENTIALS.email);
		});

		it('should hash the password in the database', async () => {
			await register(VALID_CREDENTIALS);

			const userList = await prisma.user.findMany();

			expect(userList[0].username).not.toBe(VALID_CREDENTIALS.password);
		});
	});

	describe('Internationalization', () => {
		it('should return error messages on register request without credentials', async () => {
			const response = await register({}, { language: 'es' });

			expect(response.body.errorMessage).toEqual([
				es.validation.username.required,
				es.validation.email.required,
				es.validation.password.required,
			]);
		});

		it.each`
			field         | message                              | failCase
			${'password'} | ${[es.validation.password.required]} | ${'without password field'}
			${'email'}    | ${[es.validation.email.required]}    | ${'without email field'}
			${'username'} | ${[es.validation.username.required]} | ${'without username field'}
		`(
			'should return error message on register request $failCase',
			async ({ field, message }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

				const response = await register(credentials, { language: 'es' });

				expect(response.body.errorMessage).toEqual(message);
			}
		);

		it('should return error message on register request with malformed email', async () => {
			const response = await register(
				{
					...VALID_CREDENTIALS,
					email: 'user@',
				},
				{ language: 'es' }
			);

			expect(response.body.errorMessage).toEqual([es.validation.email.invalid]);
		});

		it.each`
			password                       | message                           | failCase
			${'P@ssw0r'}                   | ${es.validation.password.min}     | ${'shorter than 8 characters'}
			${'P@ssw0rdxxxxxxxxxxxxxxxxx'} | ${es.validation.password.max}     | ${'with 24 characters or more'}
			${'Passw0rd'}                  | ${es.validation.password.invalid} | ${'without special character'}
			${'P@SSW0RD'}                  | ${es.validation.password.invalid} | ${'without lowercase letter'}
			${'p@ssw0rd'}                  | ${es.validation.password.invalid} | ${'without uppercase letter'}
			${'p@ssword'}                  | ${es.validation.password.invalid} | ${'without number'}
		`(
			'should return $message message on register request with password $failCase',
			async ({ password, message }) => {
				const response = await register(
					{
						...VALID_CREDENTIALS,
						password,
					},
					{ language: 'es' }
				);

				expect(response.body.errorMessage).toEqual([message]);
			}
		);

		it.each`
			username                   | message                       | failCase
			${'u'}                     | ${es.validation.username.min} | ${'shorter than 2 characters'}
			${'useruseruseruseruseru'} | ${es.validation.username.max} | ${'with 20 characters or more'}
		`(
			'should return $message message when username $failCase',
			async ({ username, message }) => {
				const response = await register(
					{
						...VALID_CREDENTIALS,
						username,
					},
					{ language: 'es' }
				);

				expect(response.body.errorMessage).toEqual([message]);
			}
		);

		it('should return success message on valid register request', async () => {
			const response = await register(VALID_CREDENTIALS, { language: 'es' });

			expect(response.body.message).toBe(es.user.create);
		});
	});
});
