import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import notesRouter from './routes/notes.routes';
import userRouter from './routes/user.routes';
import colorsRouter from './routes/colors.routes';
import authRouter from './routes/auth.routes';
import errorHandler from './middlewares/error.middleware';
import corsOptions from './config/corsOptions';
import credentials from './middlewares/credentials';

i18n
	.use(Backend)
	.use(middleware.LanguageDetector)
	.init({
		fallbackLng: 'en',
		lng: 'en',
		ns: ['translation'],
		defaultNS: 'translation',
		backend: {
			loadPath: './src/locales/{{lng}}/{{ns}}.json',
		},
		detection: {
			lookupHeader: 'accept-language',
		},
	});

const app = express();

app.use(middleware.handle(i18n));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);
app.use('/api/colors', colorsRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
