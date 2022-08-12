const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialectOptions: {
			ssl: { require: true, rejectUnauthorized: false },
		},
	});
}

if (process.env.NODE_ENV === 'development') {
	sequelize = new Sequelize(
		process.env.PG_NAME,
		process.env.PG_USER,
		process.env.PG_PASSWORD,
		{
			host: process.env.PG_HOST,
			port: process.env.PG_PORT,
			dialect: 'postgres',
		}
	);
}

if (process.env.NODE_ENV === 'test') {
	sequelize = new Sequelize(
		process.env.PG_TEST_NAME,
		process.env.PG_USER,
		process.env.PG_PASSWORD,
		{
			host: process.env.PG_HOST,
			port: process.env.PG_PORT,
			dialect: 'postgres',
			logging: false,
		}
	);
}

module.exports = sequelize;
