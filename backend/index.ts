import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import sequelize from './src/config/database';

const port = process.env.PORT || 8080;

const main = async (): Promise<void> => {
	try {
		await sequelize.sync();
		app.listen(port, () => {
			console.log(`App is running on port ${port}`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

main();
