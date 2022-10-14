import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../app';
import { prisma } from '../../prisma';

type RequestOptions = {
	auth?: string;
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

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

const getColors = (options: RequestOptions = {}) => {
	const agent = request(app).get(`/api/colors`);

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	return agent.send();
};

const VALID_CREDENTIALS = {
	email: 'user@testing.com',
	password: 'P4ssw0rd',
};

describe('Get Colors', () => {
	describe('Failing cases', () => {
		it('should return status 401 on get colors request without accessToken', async () => {
			const response = await getColors();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on get colors request with invalid accessToken', async () => {
			const response = await getColors({
				auth: 'invalid-token',
			});

			expect(response.status).toBe(403);
		});
	});

	describe('Success cases', () => {
		it('should return status 200 on get colors request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createColor();

			const response = await getColors({
				auth: accessToken,
			});

			expect(response.status).toBe(200);
		});

		it('should return array of colors on get colors request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createColor();

			const response = await getColors({
				auth: accessToken,
			});

			expect(response.body.length).toBe(1);
		});
	});
});
