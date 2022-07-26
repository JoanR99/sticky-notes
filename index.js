const app = require('./backend/app');
const sequelize = require('./backend/config/database');
require('dotenv').config();
require('./backend/models/note');

const port = process.env.PORT || 8080;

const main = async () => {
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
