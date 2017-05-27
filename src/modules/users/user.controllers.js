import User from './user.model';

export async function signUp(req, res, next) {
	try {
		const user = await User.create(req.body);
		return res.status(201).json(user);
	} catch (e) {
		return res.status(500).json(e);
	}
}

export function login(req, res, next) {
	res.status(200).json(req.user);

	return next();
}

// export async function fbSignup(err, user) {
// 		if (err) {
// 			return cb(err, false);
// 		}
// 		if (user) {
// 			return cb(null, user);
// 		} else {
// 			const newUser = new FBUser();
// 			newUser.id = profile.id;
// 			newUser.token = accessToken;
// 			newUser.email = profile.emails[0].value;
// 			newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
// 			newUser.firstName = profile.name.givenName;
// 			newUser.lastName = profile.name.familyName;
//
// 			newUser.save(function(err) {
// 				if (err) {
// 					throw err;
// 				}
// 				return cb(null, newUser);
// 			});
// 		}
// 	});
// });
//
// console.log('Your accessToken is :' + accessToken);
// console.log('Your refreshToken is :' + refreshToken);
// console.log('Your profile is :');
// console.log(profile);
// return cb(null, profile);)
