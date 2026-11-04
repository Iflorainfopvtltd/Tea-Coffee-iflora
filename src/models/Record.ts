import mongoose, { Schema, Model } from 'mongoose';

export interface ITeaCoffeeRecord {
  _id?: string;
  date: string; // Stored in YYYY-MM-DD format for precise date/month queries
  session?: 'Morning' | 'Evening';
  tea: number;
  coffee: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TeaCoffeeRecordSchema = new Schema<ITeaCoffeeRecord>(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    session: {
      type: String,
      enum: ['Morning', 'Evening'],
      default: 'Morning',
      required: true,
    },
    tea: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    coffee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'records',
  }
);

// Clear model cache in Next.js hot reload so schema changes always take effect
if (mongoose.models && mongoose.models.TeaCoffeeRecord) {
  delete mongoose.models.TeaCoffeeRecord;
}

export const TeaCoffeeRecord: Model<ITeaCoffeeRecord> =
  mongoose.models.TeaCoffeeRecord ||
  mongoose.model<ITeaCoffeeRecord>('TeaCoffeeRecord', TeaCoffeeRecordSchema, 'records');
