import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../app';
import sequelize from '../config/database';
import User from '../models/user';
//import Note from '../models/note';
import Color from '../models/color';

type RequestOptions = {
	auth?: string;
	isArchive?: boolean;
};

type BodyCreateUser = {
	username?: string;
	email?: string;
	password?: string;
};

type BodyCreateNote = {
	title?: string;
	content?: string;
	colorId?: number;
};

const login = (credentials = {}) =>
	request(app).post('/api/auth/login').send(credentials);

const createNote = (
	body: BodyCreateNote = {},
	options: RequestOptions = {}
) => {
	const agent = request(app).post('/api/notes');

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

const createColor = (body = { name: 'white', hex: '#fffffff' }) =>
	Color.create(body);

const getNotes = (options: RequestOptions = {}) => {
	const query =
		typeof options.isArchive === 'undefined'
			? ''
			: `?isArchive=${options.isArchive}`;
	const agent = request(app).get(`/api/notes${query}`);

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

const CREATE_NOTE_BODY = {
	title: 'hello',
	content: 'bye',
	colorId: 1,
};

describe('Get Notes', () => {
	describe('Failing cases', () => {
		it('should return status 401 on get note request without accessToken', async () => {
			const response = await getNotes();

			expect(response.status).toBe(401);
		});

		it('should return status 403 on get note request with invalid accessToken', async () => {
			const response = await getNotes({
				auth: 'invalid-token',
			});

			expect(response.status).toBe(403);
		});

		it('should return status 404 on get note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET as string;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await getNotes({
				auth: accessToken,
				isArchive: false,
			});

			expect(response.status).toBe(404);
		});

		it('should return message User not found on get note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET as string;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await getNotes({
				auth: accessToken,
				isArchive: false,
			});

			expect(response.body.errorMessage).toBe('User not found');
		});

		it('should return status 400 on get note request without isArchive query', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.status).toBe(400);
		});

		it('should return isArchive is undefined on get note request without isArchive query', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await getNotes({
				auth: accessToken,
			});

			expect(response.body.errorMessage).toEqual(['isArchive is not defined']);
		});
	});

	describe('Success cases', () => {
		it('should return status 200 on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await getNotes({
				auth: accessToken,
				isArchive: false,
			});

			expect(response.status).toBe(200);
		});

		it('should return array of notes on get note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const color = await createColor();

			await createNote(
				{ ...CREATE_NOTE_BODY, colorId: color.id },
				{
					auth: accessToken,
				}
			);

			const response = await getNotes({
				auth: accessToken,
				isArchive: false,
			});

			expect(response.body.length).toBe(1);
		});
	});
});
