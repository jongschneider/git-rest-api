module.exports = {
	facebookAuth: {
		clientID: '798559090299566',
		clientSecret: 'ec67c23c0c1005e468df1f2afcb25d50',
		callbackURL: 'http://localhost:3000/api/v1/users/login/facebook/return',
		profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
		enableProof: true
	}
};
