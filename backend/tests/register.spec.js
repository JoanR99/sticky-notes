const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/user');

const register = (credentials = {}) =>
	request(app).post('/api/users/register').send(credentials);

beforeAll(async () => {
	await sequelize.sync();
});

beforeEach(async () => {
	await User.destroy({ truncate: { cascade: true } });
});

afterAll(async () => {
	await sequelize.close();
});

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
				const credentials = { ...VALID_CREDENTIALS };
				credentials[field] = undefined;
				const response = await register(credentials);

				expect(response.status).toBe(400);
			}
		);

		const WITHOUT_CREDENTIALS_MESSAGES = [
			'Username is required',
			'Email is required',
			'Password is required',
		];

		it('should return error messages on register request without credentials', async () => {
			const response = await register();

			expect(response.body.errorMessage).toEqual(WITHOUT_CREDENTIALS_MESSAGES);
		});

		it.each`
			field         | message                     | failCase
			${'password'} | ${['Password is required']} | ${'without password field'}
			${'email'}    | ${['Email is required']}    | ${'without email field'}
			${'username'} | ${['Username is required']} | ${'without username field'}
		`(
			'should return error message on register request $failCase',
			async ({ field, message }) => {
				const credentials = { ...VALID_CREDENTIALS };
				credentials[field] = undefined;
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

			expect(response.body.errorMessage).toEqual(['Not a valid email']);
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

		const SPECIAL_CHARACTER_ERROR =
			'Password must contain at least a lowercase letter, a uppercase letter, a number and a special character ( ! @ # $ % )';

		it.each`
			password                       | message                                      | failCase
			${'P@ssw0r'}                   | ${'Password must be 8 or more characters'}   | ${'shorter than 8 characters'}
			${'P@ssw0rdxxxxxxxxxxxxxxxxx'} | ${'Password must be 24 or fewer characters'} | ${'with 24 characters or more'}
			${'Passw0rd'}                  | ${SPECIAL_CHARACTER_ERROR}                   | ${'without special character'}
			${'P@SSW0RD'}                  | ${SPECIAL_CHARACTER_ERROR}                   | ${'without lowercase letter'}
			${'p@ssw0rd'}                  | ${SPECIAL_CHARACTER_ERROR}                   | ${'without uppercase letter'}
			${'p@ssword'}                  | ${SPECIAL_CHARACTER_ERROR}                   | ${'without number'}
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
			async ({ username, message }) => {
				const response = await register({
					...VALID_CREDENTIALS,
					username,
				});

				expect(response.status).toBe(400);
			}
		);

		it.each`
			username                   | message                                           | failCase
			${'u'}                     | ${'Username must be 2 or more characters long'}   | ${'shorter than 2 characters'}
			${'useruseruseruseruseru'} | ${'Username must be 20 or fewer characters long'} | ${'with 20 characters or more'}
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

			expect(response.body.message).toBe('User created successfully');
		});

		it('should save user in database on valid register request', async () => {
			await register(VALID_CREDENTIALS);

			const userList = await User.findAll();

			expect(userList.length).toBe(1);
		});

		it('should save username and email in database on valid register request', async () => {
			await register(VALID_CREDENTIALS);

			const userList = await User.findAll();

			expect(userList[0].username).toBe(VALID_CREDENTIALS.username);
			expect(userList[0].email).toBe(VALID_CREDENTIALS.email);
		});

		it('should hash the password in the database', async () => {
			await register(VALID_CREDENTIALS);

			const userList = await User.findAll();

			expect(userList[0].username).not.toBe(VALID_CREDENTIALS.password);
		});
	});
});
