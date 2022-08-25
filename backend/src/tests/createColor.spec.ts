import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../app';
import sequelize from '../config/database';
import User from '../models/user';
import Color from '../models/color';

type RequestOptions = {
	auth?: string;
};

type BodyCreateUser = {
	username?: string;
	email?: string;
	password?: string;
};

type BodyCreateColor = {
	name?: string;
	hex?: string;
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createColor = (
	body: BodyCreateColor = {},
	options: RequestOptions = {}
) => {
	const agent = request(app).post('/api/colors');

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

const CREATE_COLOR_BODY: BodyCreateColor = {
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

				const body: BodyCreateColor = { ...CREATE_COLOR_BODY, [field]: value };

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
				'Name is required',
				'Hex is required',
			]);
		});

		it.each`
			field     | value            | message
			${'name'} | ${undefined}     | ${'Name is required'}
			${'hex'}  | ${undefined}     | ${'Hex is required'}
			${'name'} | ${1}             | ${'Name must be a string'}
			${'hex'}  | ${1}             | ${'Hex must be a string'}
			${'name'} | ${null}          | ${'Name must be a string'}
			${'hex'}  | ${null}          | ${'Hex must be a string'}
			${'name'} | ${false}         | ${'Name must be a string'}
			${'hex'}  | ${false}         | ${'Hex must be a string'}
			${'name'} | ${{ hi: 'bye' }} | ${'Name must be a string'}
			${'hex'}  | ${{ hi: 'bye' }} | ${'Hex must be a string'}
			${'name'} | ${['hi']}        | ${'Name must be a string'}
			${'hex'}  | ${['hi']}        | ${'Hex must be a string'}
		`(
			'should return $message on create note request when $field is $value',
			async ({ field, value, message }) => {
				await createUser();

				const loginResponse = await login(VALID_CREDENTIALS);

				const accessToken = loginResponse.body.accessToken;

				const body: BodyCreateColor = { ...CREATE_COLOR_BODY, [field]: value };

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
				'name',
				'hex',
				'updatedAt',
				'createdAt',
			]);
		});

		it('should save note in database on create note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const createdColor = await createColor(CREATE_COLOR_BODY, {
				auth: accessToken,
			});

			const colorInDb = await Color.findOne({
				where: { id: createdColor.body.id },
			});

			expect(colorInDb).not.toBeUndefined();
		});
	});
});
