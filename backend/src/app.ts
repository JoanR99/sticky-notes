import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import notesRouter from './routes/notes.routes';
import userRouter from './routes/user.routes';
import colorsRouter from './routes/colors.routes';
import authRouter from './routes/auth.routes';
import errorHandler from './middlewares/error.middleware';
import corsOptions from './config/corsOptions';
import credentials from './middlewares/credentials';

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

app.get('*', (_req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandler);

export default app;
