module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
const devConfig = {
	MONGO_URL: 'mongodb://localhost/makeanodejsapi-dev',
	JWT_SECRET: 'thisisasecret'
};

const testConfig = {
	MONGO_URL: 'mongodb://localhost/makeanodejsapi-test'
};

const prodConfig = {
	MONGO_URL: 'mongodb://localhost/makeanodejsapi-prod'
};

const defaultConfig = {
	PORT: process.env.PORT || 3000
};

function envConfig(env) {
	switch (env) {
		case 'development':
			return devConfig;
		case 'test':
			return testConfig;
		default:
			return prodConfig;
	}
}

exports.default = Object.assign({}, defaultConfig, envConfig(process.env.NODE_ENV));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = __webpack_require__(28);

var _validator2 = _interopRequireDefault(_validator);

var _bcryptNodejs = __webpack_require__(17);

var _jsonwebtoken = __webpack_require__(23);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongooseUniqueValidator = __webpack_require__(6);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _user = __webpack_require__(4);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: [true, 'Email is required.'],
		trim: true,
		validate: {
			validator(email) {
				return _validator2.default.isEmail(email);
			},
			message: '{VALUE} is not a valid email.'
		}
	},
	firstName: {
		type: String,
		required: [true, 'First name is required.'],
		trim: true
	},
	lastName: {
		type: String,
		required: [true, 'Last name is required.'],
		trim: true
	},
	userName: {
		type: String,
		required: [true, 'Username is required.'],
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Password is required.'],
		trim: true,
		validate: {
			validator(password) {
				return _user.passwordReg.test(password);
			},
			message: '{VALUE} is not a valid password.'
		}
	}
}, { timestamps: true });

// Allows for custom error message on unique: true properties.
UserSchema.plugin(_mongooseUniqueValidator2.default, {
	message: '{VALUE} already taken.'
});

UserSchema.pre('save', function (next) {
	if (this.isModified('password')) {
		this.password = this._hashPassword(this.password);
	}
	return next();
});

UserSchema.methods = {
	_hashPassword(password) {
		return (0, _bcryptNodejs.hashSync)(password);
	},
	authenticateUser(password) {
		return (0, _bcryptNodejs.compareSync)(password, this.password);
	},
	createToken() {
		return _jsonwebtoken2.default.sign({
			_id: this._id
		}, _constants2.default.JWT_SECRET);
	},
	toJSON() {
		return {
			id: this._id,
			userName: this.userName,
			token: `JWT ${this.createToken()}`
		};
	}
};

exports.default = _mongoose2.default.model('User', UserSchema);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.passwordReg = undefined;

var _joi = __webpack_require__(22);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passwordReg = exports.passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

exports.default = {
	signup: {
		body: {
			email: _joi2.default.string().email().required(),
			password: _joi2.default.string().regex(passwordReg).required(),
			firstName: _joi2.default.string().required(),
			lastName: _joi2.default.string().required(),
			userName: _joi2.default.string().required()
		}
	}
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.authJwt = exports.authLocal = undefined;

var _passport = __webpack_require__(7);

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = __webpack_require__(26);

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = __webpack_require__(25);

var _user = __webpack_require__(3);

var _user2 = _interopRequireDefault(_user);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Local Strategy
const localOpts = {
	usernameField: 'email'
};

const localStrategy = new _passportLocal2.default(localOpts, (() => {
	var _ref = _asyncToGenerator(function* (email, password, done) {
		try {
			const user = yield _user2.default.findOne({ email });

			if (!user) {
				return done(null, false);
			} else if (!user.authenticateUser(password)) {
				return done(null, false);
			}

			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	});

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
})());

// JWT Strategy

const jwtOpts = {
	jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeader('authorization'),
	secretOrKey: _constants2.default.JWT_SECRET
};

const jwtStrategy = new _passportJwt.Strategy(jwtOpts, (() => {
	var _ref2 = _asyncToGenerator(function* (payload, done) {
		try {
			const user = yield _user2.default.findById(payload._id);
			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	});

	return function (_x4, _x5) {
		return _ref2.apply(this, arguments);
	};
})());

_passport2.default.use(localStrategy);
_passport2.default.use(jwtStrategy);

const authLocal = exports.authLocal = _passport2.default.authenticate('local', { session: false });
const authJwt = exports.authJwt = _passport2.default.authenticate('jwt', { session: false });

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("mongoose-unique-validator");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Remove warning from promises
_mongoose2.default.Promise = global.Promise;

// Connect the db with the provided db url
try {
	_mongoose2.default.connect(_constants2.default.MONGO_URL);
} catch (err) {
	_mongoose2.default.createConnection(_constants2.default.MONGO_URL);
}

_mongoose2.default.connection.once('open', () => console.log('MongoDB running')).on('error', e => {
	throw e;
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _morgan = __webpack_require__(24);

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = __webpack_require__(18);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = __webpack_require__(19);

var _compression2 = _interopRequireDefault(_compression);

var _helmet = __webpack_require__(21);

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = __webpack_require__(7);

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

exports.default = app => {
	if (isProd) {
		app.use((0, _compression2.default)());
		app.use((0, _helmet2.default)());
	}
	app.use(_bodyParser2.default.json());
	app.use(_bodyParser2.default.urlencoded({ extended: true }));
	app.use(_passport2.default.initialize());

	if (isDev) {
		app.use((0, _morgan2.default)('dev'));
	}
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _user = __webpack_require__(16);

var _user2 = _interopRequireDefault(_user);

var _post = __webpack_require__(14);

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = app => {
	app.use('/api/v1/users', _user2.default);
	app.use('/api/v1/posts', _post2.default);
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

__webpack_require__(8);

var _middlewares = __webpack_require__(9);

var _middlewares2 = _interopRequireDefault(_middlewares);

var _modules = __webpack_require__(10);

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

(0, _middlewares2.default)(app);

app.get('/', (req, res, next) => {
	res.send('all good in the hood.');
});

(0, _modules2.default)(app);

app.listen(_constants2.default.PORT, err => {
	if (err) {
		throw err;
	} else {
		console.log(`
      Server running on port: ${_constants2.default.PORT}
      ---
      Running on ${process.env.NODE_ENV}
      `);
	}
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createPost = undefined;

let createPost = exports.createPost = (() => {
	var _ref = _asyncToGenerator(function* (req, res, next) {
		try {
			const post = yield _post2.default.createPost(req.body, req.user._id);
			return res.status(201).json(post);
		} catch (e) {
			return res.status(400).json(e);
		}
	});

	return function createPost(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
})();

var _post = __webpack_require__(13);

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _slug = __webpack_require__(27);

var _slug2 = _interopRequireDefault(_slug);

var _mongooseUniqueValidator = __webpack_require__(6);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PostSchema = new _mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Title is required.'],
		minlength: [3, 'Title must be longer.'],
		unique: true
	},
	text: {
		type: String,
		trim: true,
		required: [true, 'Text is required'],
		minlength: [10, 'Text must be longer.']
	},
	slug: {
		type: String,
		trim: true,
		lowercase: true
	},
	user: {
		type: _mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	favoriteCount: {
		type: Number,
		default: 0
	}
}, { timestamps: true });

// Allows for custom error message on unique: true properties.
PostSchema.plugin(_mongooseUniqueValidator2.default, {
	message: '{VALUE} already taken.'
});

PostSchema.pre('validate', function (next) {
	this._slugify();
	next();
});

PostSchema.methods = {
	_slugify() {
		this.slug = (0, _slug2.default)(this.title);
	}
};

PostSchema.statics = {
	createPost(args, user) {
		return this.create(Object.assign({}, args, {
			user
		}));
	}
};

exports.default = _mongoose2.default.model('Post', PostSchema);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = __webpack_require__(1);

var _expressValidation = __webpack_require__(20);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _post = __webpack_require__(12);

var postController = _interopRequireWildcard(_post);

var _auth = __webpack_require__(5);

var _post2 = __webpack_require__(29);

var _post3 = _interopRequireDefault(_post2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.post('/', _auth.authJwt, (0, _expressValidation2.default)(_post3.default.createPost), postController.createPost);

exports.default = routes;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.signUp = undefined;

let signUp = exports.signUp = (() => {
	var _ref = _asyncToGenerator(function* (req, res, next) {
		try {
			const user = yield _user2.default.create(req.body);
			return res.status(201).json(user);
		} catch (e) {
			return res.status(500).json(e);
		}
	});

	return function signUp(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
})();

exports.login = login;

var _user = __webpack_require__(3);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function login(req, res, next) {
	res.status(200).json(req.user);

	return next();
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _expressValidation = __webpack_require__(20);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _auth = __webpack_require__(5);

var _user = __webpack_require__(15);

var userController = _interopRequireWildcard(_user);

var _user2 = __webpack_require__(4);

var _user3 = _interopRequireDefault(_user2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.post('/signup', (0, _expressValidation2.default)(_user3.default.signup), userController.signUp);
routes.post('/login', _auth.authLocal, userController.login);

exports.default = routes;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("express-validation");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = __webpack_require__(22);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	createPost: {
		body: {
			title: _joi2.default.string().min(3).required(),
			text: _joi2.default.string().min(10).required()
		}
	}
};

/***/ })
/******/ ]);