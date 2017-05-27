import { Router } from 'express';
import validate from 'express-validation';
import passport from 'passport';

import { authLocal, authFacebook } from '../../services/auth.services';

import * as userController from './user.controllers';
import userValidation from './user.validations';

const routes = new Router();

routes.post('/signup', validate(userValidation.signup), userController.signUp);
routes.post('/login', authLocal, userController.login);

<<<<<<< HEAD
routes.get('/hello', (req, res) => {
	res.send('hello');
=======
//added for FB
routes.get('/login/facebook', authFacebook);

// passport.authenticate('facebook')
routes.get('/login/facebook/return', authFacebook, function(req, res) {
	res.redirect('/api/v1/users/success');
});

// routes.get(
// 	'/login/facebook/return',
// 	passport.authenticate('facebook', { failureRedirect: '/' }),
// 	function(req, res) {
// 		res.redirect('/api/v1/users/success');
// 	}
// );

routes.get('/success', (req, res, next) => {
	res.send('success.');
>>>>>>> FBretry2
});

export default routes;
