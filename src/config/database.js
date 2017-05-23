import mongoose from 'mongoose';

import constants from './constants';

// Remove warning from promises
mongoose.Promise = global.Promise;

// Connect the db with the provided db url
try {
	mongoose.connect(constants.MONGO_URL);
} catch (err) {
	mongoose.createConnection(constants.MONGO_URL);
}

mongoose.connection
	.once('open', () => console.log('MongoDB running'))
	.on('error', e => {
		throw e;
	});
