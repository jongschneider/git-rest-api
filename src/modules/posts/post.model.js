import mongoose, { Schema } from 'mongoose';
import slug from 'slug';
import uniqueValidator from 'mongoose-unique-validator';

const PostSchema = new Schema(
	{
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
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		favoriteCount: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
);

// Allows for custom error message on unique: true properties.
PostSchema.plugin(uniqueValidator, {
	message: '{VALUE} already taken.'
});

PostSchema.pre('validate', function(next) {
	this._slugify();
	next();
});

PostSchema.methods = {
	_slugify() {
		this.slug = slug(this.title);
	}
};

PostSchema.statics = {
	createPost(args, user) {
		return this.create({
			...args,
			user
		});
	}
};

export default mongoose.model('Post', PostSchema);
