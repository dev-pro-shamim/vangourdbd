import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  lastLogin?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    roleId: { type: String, required: true },
    roleName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ roleId: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
