import express from 'express';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';

require('dotenv').config();

const app = express();

//Set up mongoose connection
try {
	const mongoDB = process.env.DB;
	mongoose.connect(mongoDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
} catch (err) {
	console.log(err);
}

//Setup initializations
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false }));

app.use('/item', require('./routes/item'));
app.use(authRouter);
app.use(currentUserRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server start on port: ${port}`);
});
