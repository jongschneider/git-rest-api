import express from 'express';
import constants from './config/constants';

import './config/database';

import middelWaresConfig from './config/middlewares';

const app = express();

middelWaresConfig(app);

app.get('/', (req, res, next) => {
	res.send('all good in the hood.');
});

app.listen(constants.PORT, err => {
	if (err) {
		throw err;
	} else {
		console.log(
			`
      Server running on port: ${constants.PORT}
      ---
      Running on ${process.env.NODE_ENV}
      `
		);
	}
});
