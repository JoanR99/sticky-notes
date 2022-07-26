const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize =
	process.env.NODE_ENV === 'production'
		? new Sequelize(process.env.DATABASE_URL, {
				dialectOptions: {
					ssl: { require: true, rejectUnauthorized: false },
				},
		  })
		: new Sequelize(
				process.env.PG_NAME,
				process.env.PG_USER,
				process.env.PG_PASSWORD,
				{
					host: process.env.PG_HOST,
					port: process.env.PG_PORT,
					dialect: 'postgres',
				}
		  );

module.exports = sequelize;
