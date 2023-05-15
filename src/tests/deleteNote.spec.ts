import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../app';
import { prisma } from '../../prisma';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';
import {
	CREATE_NOTE_BODY,
	VALID_CREDENTIALS,
	createNote,
	createUser,
	login,
} from './utils';

type RequestOptions = {
	auth?: string;
	isArchive?: boolean;
	language?: string;
};

const deleteNote = (id: number = 1, options: RequestOptions = {}) => {
	const agent = request(app).delete(`/api/notes/${id}`);

	if ('auth' in options) {
		agent.set('Authorization', `Bearer ${options.auth}`);
	}

	if ('language' in options) {
		agent.set('Accept-Language', options.language as string);
	}

	return agent.send();
};

describe('Delete Note', () => {
	describe('Failing cases', () => {
		it('should return status 401 on delete note request without accessToken', async () => {
			const response = await deleteNote();

			expect(response.status).toBe(401);
		});

		it('should return status 401 on delete note request with invalid accessToken', async () => {
			const response = await deleteNote(1, {
				auth: 'invalid-token',
			});

			expect(response.status).toBe(401);
		});

		it('should return status 404 on delete note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET!;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return status 404 on delete note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.status).toBe(404);
		});

		it('should return message User not found on delete note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET!;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe(en.user.not_found);
		});

		it('should return message Note not found on delete note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: accessToken,
			});

			expect(response.body.errorMessage).toBe(en.note.not_found);
		});

		it('should return 403 when user is not author of the note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await createUser({
				...VALID_CREDENTIALS,
				username: 'user2',
				email: 'user2@example.com',
			});

			const secondLoginResponse = await login({
				...VALID_CREDENTIALS,
				email: 'user2@example.com',
			});

			const secondAccessToken = secondLoginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: secondAccessToken,
			});

			expect(response.status).toBe(403);
		});
	});

	describe('Success Cases', () => {
		it('should return status 200 on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const cratedNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await deleteNote(cratedNote.body.id, {
				auth: accessToken,
			});

			expect(response.status).toBe(200);
		});

		it('should return note body on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const cratedNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			const response = await deleteNote(cratedNote.body.id, {
				auth: accessToken,
			});

			expect(response.body.title).toBe('hello');
			expect(response.body.content).toBe('bye');
			expect(response.body.color).toBe('white');
			expect(response.body.id).toBe(1);
		});

		it('should delete note on delete note request success', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const cratedNote = await createNote(CREATE_NOTE_BODY, {
				auth: accessToken,
			});

			await deleteNote(cratedNote.body.id, {
				auth: accessToken,
			});

			const note = await prisma.note.findUnique({
				where: { id: cratedNote.body.id },
			});

			expect(note).toBeNull();
		});
	});

	describe('Internationalization', () => {
		it('should return message User not found on delete note request with invalid user', async () => {
			const secret = process.env.ACCESS_TOKEN_SECRET!;

			const payload = {
				user: {
					id: 5,
				},
			};

			const signOptions = {
				expiresIn: '1m',
			};

			const accessToken = jwt.sign(payload, secret, signOptions);

			const response = await deleteNote(1, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.user.not_found);
		});

		it('should return message Note not found on delete note request with invalid note', async () => {
			await createUser();

			const loginResponse = await login(VALID_CREDENTIALS);

			const accessToken = loginResponse.body.accessToken;

			const response = await deleteNote(1, {
				auth: accessToken,
				language: 'es',
			});

			expect(response.body.errorMessage).toBe(es.note.not_found);
		});
	});
});
