import mongoose, { Schema, Document } from "mongoose";
import type { IUser } from "@repo/shared-types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    googleId: { type: String, sparse: true },
    friends: { type: [Schema.Types.ObjectId], ref: "User" },
    rating: { type: Number, default: 10 },
  },
  { timestamps: true },
);

const UserModal = mongoose.model<IUser>("User", UserSchema);

export { UserModal, IUser };
