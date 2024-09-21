import mongoose, { Schema, Document } from 'mongoose';

interface IRating extends Document {
  schoolId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
  timestamp: Date;
}

const RatingSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IRating>('Rating', RatingSchema);import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  authProvider: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authProvider: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);
import mongoose, { Schema, Document } from 'mongoose';

interface ISchool extends Document {
  name: string;
  description: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  logo: string;
  photos: string[];
  attachments: string[];
  averageRating: number;
}

const SchoolSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  logo: { type: String },
  photos: [{ type: String }],
  attachments: [{ type: String }],
  averageRating: { type: Number, default: 0 }
});

SchoolSchema.index({ location: '2dsphere' });

export default mongoose.model<ISchool>('School', SchoolSchema);
