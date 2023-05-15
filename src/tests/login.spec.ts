import request from 'supertest';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';
import { VALID_CREDENTIALS, createUser } from './utils';

type RequestOptions = {
	language?: string;
};

const login = (credentials = {}, options: RequestOptions = {}) => {
	const agent = request(app).post('/api/users/login');

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
	}

	return agent.send(credentials);
};

describe('Login', () => {
	describe('Failing cases', () => {
		it('should return status 400 on login request without credentials', async () => {
			const response = await login();

			expect(response.status).toBe(400);
		});

		it.each`
			field         | failCase
			${'password'} | ${'without password field'}
			${'email'}    | ${'without email field'}
		`(
			'should return status 400 on login request $failCase',
			async ({ field }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

				const response = await login(credentials);

				expect(response.status).toBe(400);
			}
		);

		it('should return error messages on login request without credentials', async () => {
			const response = await login();

			expect(response.body.errorMessage).toEqual([
				en.validation.email.required,
				en.validation.password.required,
			]);
		});

		it.each`
			field         | message                              | failCase
			${'password'} | ${[en.validation.password.required]} | ${'without password field'}
			${'email'}    | ${[en.validation.email.required]}    | ${'without email field'}
		`(
			'should return error message on login request $failCase',
			async ({ field, message }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

				console.log(credentials);

				const response = await login(credentials);

				expect(response.body.errorMessage).toEqual(message);
			}
		);

		it('should return status 400 on login request with malformed email', async () => {
			const response = await login({ ...VALID_CREDENTIALS, email: 'user@' });

			expect(response.status).toBe(400);
		});

		it('should return error message on login request with malformed email', async () => {
			const response = await login({ ...VALID_CREDENTIALS, email: 'user@' });

			expect(response.body.errorMessage).toEqual([en.validation.email.invalid]);
		});

		it('should return status 401 on login request with unregistered email', async () => {
			const response = await login({
				email: 'user@testing.com',
				password: 'P4ssw0rd',
			});

			expect(response.status).toBe(401);
		});

		it('should return error message on login request with unregistered email', async () => {
			const response = await login({
				email: 'user@testing.com',
				password: 'P4ssw0rd',
			});

			expect(response.body.errorMessage).toBe(en.unauthorized);
		});

		it('should return status 401 on login request with wrong password', async () => {
			await createUser();

			const response = await login({
				email: 'user@testing.com',
				password: 'password',
			});

			expect(response.status).toBe(401);
		});

		it('should return error message on login request with wrong password', async () => {
			await createUser();

			const response = await login({
				email: 'user@testing.com',
				password: 'password',
			});

			expect(response.body.errorMessage).toBe(en.unauthorized);
		});
	});

	describe('Success cases', () => {
		it('should return status 200 when login with valid credentials', async () => {
			await createUser();

			const response = await login(VALID_CREDENTIALS);

			expect(response.status).toBe(200);
		});

		it('should return accessToken when login success', async () => {
			await createUser();

			const response = await login(VALID_CREDENTIALS);

			expect(response.body.accessToken).not.toBeUndefined();
		});

		it('should create and save refreshToken in database', async () => {
			await createUser();

			await login(VALID_CREDENTIALS);

			const user = await prisma.user.findUnique({
				where: { email: VALID_CREDENTIALS.email },
			});

			expect(user?.refreshToken).not.toBeUndefined();
		});

		it('should return refreshToken cookie when login success', async () => {
			await createUser();

			const response = await login(VALID_CREDENTIALS);

			expect(response.header['set-cookie']).not.toBeUndefined();
		});
	});

	describe('Internationalization', () => {
		it('should return error messages on login request without credentials', async () => {
			const response = await login({}, { language: 'es' });

			expect(response.body.errorMessage).toEqual([
				es.validation.email.required,
				es.validation.password.required,
			]);
		});

		it.each`
			field         | message                              | failCase
			${'password'} | ${[es.validation.password.required]} | ${'without password field'}
			${'email'}    | ${[es.validation.email.required]}    | ${'without email field'}
		`(
			'should return error message on login request $failCase',
			async ({ field, message }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

				const response = await login(credentials, { language: 'es' });

				expect(response.body.errorMessage).toEqual(message);
			}
		);

		it('should return error message on login request with malformed email', async () => {
			const response = await login(
				{ ...VALID_CREDENTIALS, email: 'user@' },
				{ language: 'es' }
			);

			expect(response.body.errorMessage).toEqual([es.validation.email.invalid]);
		});

		it('should return error message on login request with unregistered email', async () => {
			const response = await login(
				{
					email: 'user@testing.com',
					password: 'P4ssw0rd',
				},
				{ language: 'es' }
			);

			expect(response.body.errorMessage).toBe(es.unauthorized);
		});

		it('should return error message on login request with wrong password', async () => {
			await createUser();

			const response = await login(
				{
					email: 'user@testing.com',
					password: 'password',
				},
				{ language: 'es' }
			);

			expect(response.body.errorMessage).toBe(es.unauthorized);
		});
	});
});
