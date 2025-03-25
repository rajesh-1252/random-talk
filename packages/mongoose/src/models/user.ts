import mongoose, { Schema } from "mongoose";
import type { IUser } from "@repo/shared-types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    profilePicture: { type: String },
    bio: { type: String, maxlength: 250 },
    phone: { type: String },
    googleId: { type: String, sparse: true },
    friends: { type: [Schema.Types.ObjectId], ref: "User" },
    blockedUsers: { type: [Schema.Types.ObjectId], ref: "User" },
    rating: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["online", "offline", "away", "busy"],
      default: "offline",
    },
    lastSeen: { type: Date },
    device: {
      platform: { type: String },
      token: { type: String },
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export { UserModel };
