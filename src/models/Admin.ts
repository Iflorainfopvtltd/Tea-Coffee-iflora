import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      default: 'Iflora',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'admin', // Explicitly using 'admin' collection as requested
  }
);

// Prevent model overwrite upon hot reloads in Next.js
export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema, 'admin');

/**
 * Ensures the default admin account exists in the 'admin' collection
 */
export async function seedAdminIfNotExists() {
  const adminEmail = 'iflora@gmail.com';
  const adminName = 'Iflora';
  const defaultPassword = 'TeaCoffee#2026';

  const existing = await Admin.findOne({ email: adminEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    });
    console.log(`[Database Seed] Default Admin created: ${adminEmail}`);
  }
}

