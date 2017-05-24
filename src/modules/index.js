import userRoutes from './users/user.routes';
import { authJwt } from '../services/auth.services';

export default app => {
	app.use('/api/v1/users', userRoutes);
	app.get('/hello', authJwt, (req, res, next) => {
		res.send('this is a private route, dawg!');
	});
};
