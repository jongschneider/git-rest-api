import { Router } from 'express';
import validate from 'express-validation';

import passport from 'passport';

import { authLocal, authFB } from '../../services/auth.services';

import * as userController from './user.controllers';
import userValidation from './user.validations';
const routes = new Router();

routes.post('/signup', validate(userValidation.signup), userController.signUp);
routes.post('/login', authLocal, userController.login);

routes.get('/facebook', authFB);
// routes.get(
// 	'/auth/facebook/callback',
// 	passport.authenticate('facebook', {
// 		successRedirect: 'http://www.espn.com/',
// 		failureRedirect: 'https://www.google.com/'
// 	})
// );

export default routes;
