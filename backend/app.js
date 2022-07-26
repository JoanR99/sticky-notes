const express = require('express');
const app = express();
const notesRouter = require('./routes/notes.routes');
const userRouter = require('./routes/user.routes');
const refreshRouter = require('./routes/refreshToken.routes');
const errorHandler = require('./middlewares/error.middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const cors = require('cors');
const Color = require('./models/color');

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);
app.use('/api/refresh', refreshRouter);

app.post('/api/colors', async (req, res) => {
	const { name, hex } = req.body;
	const color = await Color.create({ name, hex });

	res.json(color);
});

app.delete('/api/colors/:id', async (req, res) => {
	const { id } = req.params;
	const color = await Color.destroy({ where: { id } });

	res.json(color);
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandler);

module.exports = app;
