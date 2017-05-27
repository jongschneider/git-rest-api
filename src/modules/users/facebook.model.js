import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

import constants from '../../config/constants';

const FacebookSchema = new Schema(
	{
		id: {
			type: String,
			trim: true
		},
		token: {
			type: String,
			trim: true
		},
		email: {
			type: String,
			trim: true
		},
		name: {
			type: String,
			trim: true
		},
		firstName: {
			type: String,
			trim: true
		},
		lastName: {
			type: String,
			trim: true
		}
	},
	{ timestamps: true }
);

FacebookSchema.methods = {
	createToken() {
		return jwt.sign(
			{
				_id: this._id
			},
			constants.JWT_SECRET
		);
	},
	toJSON() {
		return {
			id: this._id,
			name: this.name,
			token: `JWT ${this.createToken()}`
		};
	}
};

export default mongoose.model('FBUser', FacebookSchema, 'users');
