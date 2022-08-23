import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user';
import Note from '../models/note';
import Color from '../models/color';

const PG_URL: string = process.env.DATABASE_URL ?? '';
const PG_USER: string = process.env.PG_USER ?? '';
const PG_PASSWORD: string | undefined = process.env.PG_PASSWORD;
const PG_NAME: string =
	(process.env.NODE_ENV === 'development'
		? process.env.PG_NAME
		: process.env.PG_TEST_NAME) ?? '';

const sequelize =
	process.env.NODE_ENV === 'production'
		? new Sequelize(PG_URL, {
				dialectOptions: {
					ssl: { require: true, rejectUnauthorized: false },
				},
		  })
		: new Sequelize({
				database: PG_NAME,
				dialect: 'postgres',
				username: PG_USER,
				password: PG_PASSWORD,
				models: [User, Note, Color],
				logging: false,
		  });

export default sequelize;
