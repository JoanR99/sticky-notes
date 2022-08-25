import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../app';
import { prisma } from '../../prisma';

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createUser = async (
	credentials = { ...VALID_CREDENTIALS, username: 'user' }
) => {
	credentials.password = await bcrypt.hash(credentials.password, 10);
	return prisma.user.create({ data: credentials });
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
				'Email is required',
				'Password is required',
			]);
		});

		it.each`
			field         | message                     | failCase
			${'password'} | ${['Password is required']} | ${'without password field'}
			${'email'}    | ${['Email is required']}    | ${'without email field'}
		`(
			'should return error message on login request $failCase',
			async ({ field, message }) => {
				const credentials = { ...VALID_CREDENTIALS, [field]: undefined };

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

			expect(response.body.errorMessage).toEqual(['Not a valid email']);
		});

		it('should return status 401 on login request with unregisted email', async () => {
			const response = await login({
				email: 'user@testing.com',
				password: 'P4ssw0rd',
			});

			expect(response.status).toBe(401);
		});

		it('should return error message on login request with unregisted email', async () => {
			const response = await login({
				email: 'user@testing.com',
				password: 'P4ssw0rd',
			});

			expect(response.body.errorMessage).toBe('Wrong credentials');
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

			expect(response.body.errorMessage).toBe('Wrong credentials');
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
});
