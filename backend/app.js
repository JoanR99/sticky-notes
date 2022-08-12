const express = require('express');
const notesRouter = require('./routes/notes.routes');
const userRouter = require('./routes/user.routes');
const colorsRouter = require('./routes/colors.routes');
const authRouter = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const cors = require('cors');
const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);
app.use('/api/colors', colorsRouter);
app.use('/api/auth', authRouter);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandler);

module.exports = app;
