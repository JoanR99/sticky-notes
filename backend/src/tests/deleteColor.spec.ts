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

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createColor = (body = { name: 'white', hex: '#fffffff' }) =>
	Color.create(body);

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

const deleteColor = (id: number = 1, options: RequestOptions = {}) => {
	const agent = request(app).delete(`/api/colors/${id}`);

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	return agent.send();
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

describe('Delete Color', () => {
	describe('Failing cases', () => {
		it('should return status 401 on delete color request without accessToken', async () => {
			const response = await deleteColor();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on delete color request with invalid accessToken', async () => {
			const response = await deleteColor(1, {
				auth: 'invalid-token',
			});

			expect(response.status).toBe(403);
		});

		it('should return status 404 on delete color request with invalid color', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteColor(1, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return message color not found on delete color request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteColor(1, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe('Color not found');
		});
	});

	describe('Success Cases', () => {
		it('should return status 200 on delete color request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const response = await deleteColor(color.id, {
				auth: accessToken,
			});

			expect(response.status).toBe(200);
		});

		it('should return message color deleted successfully on delete color request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			const response = await deleteColor(color.id, {
				auth: accessToken,
			});

			expect(response.body.message).toBe('Color deleted successfully');
		});

		it('should delete color on delete color request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			await deleteColor(color.id, {
				auth: accessToken,
			});

			const deletedColor = await Color.findOne({ where: { id: color.id } });

			expect(deletedColor).toBeNull();
		});
	});
});
